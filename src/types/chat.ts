export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}
