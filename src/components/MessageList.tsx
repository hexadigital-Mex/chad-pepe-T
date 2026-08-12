import { useEffect, useRef } from 'react'
import MessageItem from './MessageItem'
import WelcomeScreen from './WelcomeScreen'
import { useChatStore } from '../store/chatStore'

function MessageList() {
  const messages = useChatStore((state) => state.messages)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null)
  const wasAtBottomRef = useRef(true)

  useEffect(() => {
    if (wasAtBottomRef.current) {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages])

  function handleScroll() {
    const container = containerRef.current
    if (!container) return
    wasAtBottomRef.current =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 50
  }

  if (messages.length === 0) {
    return <WelcomeScreen />
  }

  return (
    <div
      className="chat-messages"
      ref={containerRef}
      onScroll={handleScroll}
    >
      {messages.map((message) => (
        <MessageItem key={message.id} id={message.id} />
      ))}
      <div ref={endRef} className="chat-scroll-anchor" />
    </div>
  )
}

export default MessageList
