import { useSettings } from '../context/settings'

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function ChatHeader() {
  const { theme, toggleTheme } = useSettings()
  const isDark = theme === 'dark'

  return (
    <header className="chat-header">
      <h2>Chat</h2>
      <div className="chat-header-actions">
        <button
          className={isDark ? 'theme-switch dark' : 'theme-switch'}
          type="button"
          onClick={toggleTheme}
          role="switch"
          aria-checked={isDark}
          aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        >
          <span className="theme-knob" aria-hidden="true" />
          <span className={isDark ? 'theme-option' : 'theme-option active'}>
            <SunIcon />
          </span>
          <span className={isDark ? 'theme-option active' : 'theme-option'}>
            <MoonIcon />
          </span>
        </button>
      </div>
    </header>
  )
}

export default ChatHeader
