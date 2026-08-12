import type { IncomingMessage, ServerResponse } from 'node:http'
import { OpenAI } from 'openai'
import type { ChatCompletionChunk } from 'openai/resources/chat/completions'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const API_KEY = process.env.OPENAI_API_KEY ?? process.env.OPENROUTER_API_KEY
const BASE_URL = process.env.OPENAI_BASE_URL
const MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini'
const encoder = new TextEncoder()

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

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  try {
    if (!API_KEY) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          error: 'Falta configurar OPENAI_API_KEY (u OPENROUTER_API_KEY) en las variables de entorno',
        }),
      )
      return
    }

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

    const openai = new OpenAI({
      apiKey: API_KEY,
      ...(BASE_URL ? { baseURL: BASE_URL } : {}),
    })

    const stream: AsyncIterable<ChatCompletionChunk> =
      await openai.chat.completions.create({
        model: MODEL,
        messages,
        stream: true,
      })

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
  } catch (err) {
    if (!res.writableEnded) {
      res.writeHead(errorStatus(err), { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: errorMessage(err) }))
    }
  }
}