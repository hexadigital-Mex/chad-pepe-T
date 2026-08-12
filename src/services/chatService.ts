import type { ChatMessage } from '../types/chat'

export async function streamChat(
  messages: ChatMessage[],
  signal: AbortSignal,
  onToken: (token: string) => void,
): Promise<void> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  })

  if (!response.ok) {
    const bodyText = await response.text()
    throw new Error(bodyText || `Error ${response.status}`)
  }

  if (!response.body) {
    throw new Error('El servidor no envió un stream')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    const fragment = decoder.decode(value, { stream: true })
    onToken(fragment)
  }
}
