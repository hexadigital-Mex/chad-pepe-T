import { useEffect } from 'react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { useChatStore } from '../store/chatStore'

function ChatApp() {
  const isLoading = useChatStore((state) => state.isLoading)
  const error = useChatStore((state) => state.error)
  const stop = useChatStore((state) => state.stop)

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return (
    <section className="chat">
      <ChatHeader />

      <MessageList />

      {error && <p className="chat-error">{error}</p>}

      {isLoading && (
        <div className="chat-status">
          <button className="chat-stop" type="button" onClick={stop}>
            Detener
          </button>
          <p className="chat-processing">
            La IA está procesando tu mensaje...
          </p>
        </div>
      )}

      <MessageInput />
    </section>
  )
}

export default ChatApp
