interface TypingDotsProps {
  visible: boolean
}

function TypingDots({ visible }: TypingDotsProps) {
  return (
    <span
      className={`typing-dots ${visible ? 'visible' : ''}`}
      role="status"
      aria-label="La IA está escribiendo"
    >
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </span>
  )
}

export default TypingDots
