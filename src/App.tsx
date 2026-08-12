import ChatApp from './components/ChatApp'
import { SettingsProvider } from './context/SettingsProvider'
import './App.css'

function App() {
  return (
    <main>
      <SettingsProvider>
        <ChatApp />
      </SettingsProvider>
    </main>
  )
}

export default App
