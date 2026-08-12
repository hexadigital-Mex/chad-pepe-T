import type { FormEvent } from 'react'
import { useChatStore } from '../store/chatStore'

function MessageInput() {
  const draft = useChatStore((state) => state.draft)
  const isLoading = useChatStore((state) => state.isLoading)
  const setDraft = useChatStore((state) => state.setDraft)
  const sendMessage = useChatStore((state) => state.sendMessage)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void sendMessage(draft)
  }

  return (
    <form className="chat-form" onSubmit={handleSubmit}>
      <input
        className="chat-input"
        type="text"
        placeholder="Escribe un mensaje..."
        value={draft}
        disabled={isLoading}
        onChange={(event) => setDraft(event.target.value)}
      />
      <button className="chat-send" type="submit" disabled={isLoading}>
        {isLoading ? <span className="chat-spinner" /> : 'Enviar'}
      </button>
    </form>
  )
}

export default MessageInput
