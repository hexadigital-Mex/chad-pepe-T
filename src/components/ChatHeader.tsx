import { useSettings } from '../context/settings'

function ChatHeader() {
  const { user, theme, toggleTheme } = useSettings()

  return (
    <header className="chat-header">
      <h2>Chat</h2>
      <div className="chat-header-actions">
        <span className="chat-user">{user ? user.name : 'Invitado'}</span>
        <button className="chat-theme" type="button" onClick={toggleTheme}>
          {theme === 'light' ? 'Tema oscuro' : 'Tema claro'}
        </button>
      </div>
    </header>
  )
}

export default ChatHeader
