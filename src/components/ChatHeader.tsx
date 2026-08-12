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

function Logo() {
  return (
    <span className="chat-logo-badge" role="img" aria-label="Chad Pepe T">
      <span className="chat-logo-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <g
            className="frog-glow"
            stroke="var(--logo-color)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <ellipse cx="8" cy="7" rx="3.4" ry="3.8" />
            <ellipse cx="16" cy="7" rx="3.4" ry="3.8" />
            <circle cx="8" cy="6.8" r="1.3" fill="var(--logo-color)" stroke="none" />
            <circle cx="16" cy="6.8" r="1.3" fill="var(--logo-color)" stroke="none" />
            <path d="M4 10.8C4 16.5 7.5 20 12 20s8-3.5 8-9.2" />
            <path d="M6 13.4h1.6M16.4 13.4H18" />
            <path d="M9.5 16.2c1.7 1.2 3.3 1.2 5 0" />
          </g>
        </svg>
      </span>
      <span className="chat-logo-name">Chad Pepe T</span>
      <span className="chat-logo-online" aria-hidden="true" />
    </span>
  )
}

function ChatHeader() {
  const { theme, toggleTheme } = useSettings()
  const isDark = theme === 'dark'

  return (
    <header className="chat-header">
      <h2 className="chat-header-title">
        <Logo />
      </h2>
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
