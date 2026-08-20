import type { ChatMessage } from '../types/chat'

const REQUEST_TIMEOUT_MS = 30_000

export async function streamChat(
  messages: ChatMessage[],
  signal: AbortSignal,
  onToken: (token: string) => void,
): Promise<void> {
  const controller = new AbortController()
  let timedOut = false
  const timeout = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, REQUEST_TIMEOUT_MS)
  const onExternalAbort = () => controller.abort()

  if (signal.aborted) controller.abort()
  else signal.addEventListener('abort', onExternalAbort)

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
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
  } catch (err) {
    if (timedOut) {
      throw new Error('La petición excedió el límite de 30 segundos', {
        cause: err,
      })
    }
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new DOMException(err.message, err.name)
    }
    throw new Error(
      err instanceof Error ? err.message : 'Error de conexión con el servidor',
      { cause: err },
    )
  } finally {
    clearTimeout(timeout)
    signal.removeEventListener('abort', onExternalAbort)
  }
}
