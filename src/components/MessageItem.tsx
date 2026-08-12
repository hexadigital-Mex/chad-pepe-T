import { useChatStore } from '../store/chatStore'
import MarkdownText from './MarkdownText'
import TypingDots from './TypingDots'

const TYPING_THRESHOLD = 4

interface MessageItemProps {
  id: string
}

function MessageItem({ id }: MessageItemProps) {
  const message = useChatStore((state) =>
    state.messages.find((m) => m.id === id),
  )
  const isStreaming = useChatStore((state) => state.isStreaming)
  const lastId = useChatStore((state) => state.messages[state.messages.length - 1]?.id)

  if (!message) return null

  const isUser = message.role === 'user'
  const isLastAssistant =
    message.role === 'assistant' && message.id === lastId
  const showTyping =
    isStreaming && isLastAssistant && message.content.length < TYPING_THRESHOLD

  return (
    <div
      className={`chat-message ${isUser ? 'message-user' : 'message-assistant'}`}
    >
      <span className="chat-message-author">
        {isUser ? 'Tú' : 'Asistente'}
      </span>
      {isUser ? (
        <p className="chat-message-text">{message.content}</p>
      ) : (
        <div className="assistant-body">
          <TypingDots visible={showTyping} />
          {!showTyping && message.content && (
            <MarkdownText text={message.content} />
          )}
        </div>
      )}
    </div>
  )
}

export default MessageItem
