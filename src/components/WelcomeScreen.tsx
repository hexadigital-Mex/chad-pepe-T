import { useChatStore } from '../store/chatStore'
import { useSettings } from '../context/settings'

const SUGGESTIONS = [
  'Explícame un concepto como si tuviera 10 años',
  'Ayúdame a redactar un correo profesional',
  'Dame ideas para resolver un problema',
  'Resume las ideas clave de un texto que te pase',
]

function WelcomeScreen() {
  const sendMessage = useChatStore((state) => state.sendMessage)
  const { user } = useSettings()

  const name = user?.name ?? 'Invitado'

  function handleSuggestion(suggestion: string) {
    void sendMessage(suggestion)
  }

  return (
    <div className="chat-welcome">
      <h3 className="chat-welcome-title">
        ¿En qué puedo ayudarte hoy, {name}?
      </h3>
      <p className="chat-welcome-subtitle">
        Pregúntame lo que quieras: código, conceptos o cualquier otra cosa.
      </p>
      <div className="chat-suggestions">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            className="chat-suggestion"
            type="button"
            onClick={() => handleSuggestion(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

export default WelcomeScreen
