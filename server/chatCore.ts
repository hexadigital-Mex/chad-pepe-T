import type { IncomingMessage, ServerResponse } from 'node:http'
import { OpenAI } from 'openai'
import type { ChatCompletionChunk } from 'openai/resources/chat/completions'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatConfig {
  apiKey?: string
  baseURL?: string
  model: string
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => {
      chunks.push(Buffer.from(chunk))
    })
    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf-8'))
    })
    req.on('error', reject)
  })
}

function errorStatus(err: unknown): number {
  if (typeof err === 'object' && err !== null && 'status' in err) {
    const status = (err as { status?: unknown }).status
    if (typeof status === 'number') return status
  }
  return 500
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  return 'Error interno del servidor'
}

export function createChatHandler(config: ChatConfig) {
  const encoder = new TextEncoder()

  return async function chatHandler(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    try {
      if (!config.apiKey) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            error:
              'Falta configurar OPENAI_API_KEY (u OPENROUTER_API_KEY) en las variables de entorno',
          }),
        )
        return
      }

      const openai = new OpenAI({
        apiKey: config.apiKey,
        ...(config.baseURL ? { baseURL: config.baseURL } : {}),
      })

      if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Método no permitido' }))
        return
      }

      let messages: ChatMessage[]
      try {
        const body = JSON.parse(await readBody(req)) as {
          messages?: ChatMessage[]
        }
        messages = Array.isArray(body.messages) ? body.messages : []
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Body inválido' }))
        return
      }

      let stream: AsyncIterable<ChatCompletionChunk>
      try {
        stream = await openai.chat.completions.create({
          model: config.model,
          messages,
          stream: true,
        })
      } catch (err) {
        res.writeHead(errorStatus(err), { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: errorMessage(err) }))
        return
      }

      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      })

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content
        if (token) {
          res.write(encoder.encode(token))
        }
      }

      res.end()
    } catch {
      if (!res.writableEnded) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Error interno del servidor' }))
      }
    }
  }
}
