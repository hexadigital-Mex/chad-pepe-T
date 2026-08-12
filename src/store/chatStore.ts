import { create } from 'zustand'
import { streamChat } from '../services/chatService'
import type { ChatMessage, Message } from '../types/chat'

interface ChatStore {
  messages: Message[]
  isLoading: boolean
  isStreaming: boolean
  error: string | null
  draft: string
  setDraft: (text: string) => void
  addUserMessage: (text: string) => void
  updateLastAssistantMessage: (text: string) => void
  sendMessage: (text: string) => Promise<void>
  stop: () => void
}

let activeController: AbortController | null = null

export const useChatStore = create<ChatStore>()((set, get) => ({
  messages: [],
  isLoading: false,
  isStreaming: false,
  error: null,
  draft: '',

  setDraft: (text) => set({ draft: text }),

  addUserMessage: (text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: crypto.randomUUID(), role: 'user', content: text },
      ],
    })),

  updateLastAssistantMessage: (text) =>
    set((state) => {
      let index = -1
      for (let i = state.messages.length - 1; i >= 0; i--) {
        if (state.messages[i].role === 'assistant') {
          index = i
          break
        }
      }
      if (index === -1) return {}
      return {
        messages: state.messages.map((message, i) =>
          i === index ? { ...message, content: message.content + text } : message,
        ),
      }
    }),

  sendMessage: async (text) => {
    const trimmed = text.trim()
    if (!trimmed || get().isLoading) return

    get().addUserMessage(trimmed)

    const history: ChatMessage[] = get().messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
    }

    set((state) => ({
      messages: [...state.messages, assistantMessage],
      isLoading: true,
      isStreaming: true,
      error: null,
      draft: '',
    }))

    const controller = new AbortController()
    activeController = controller

    try {
      await streamChat(history, controller.signal, (token) => {
        get().updateLastAssistantMessage(token)
      })
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      set({
        error: err instanceof Error ? err.message : 'Ocurrió un error inesperado',
      })
    } finally {
      if (activeController === controller) {
        activeController = null
      }
      set({ isLoading: false, isStreaming: false })

      const messages = get().messages
      const last = messages[messages.length - 1]
      if (last && last.role === 'assistant' && last.content === '') {
        set({ messages: messages.slice(0, -1) })
      }
    }
  },

  stop: () => {
    activeController?.abort()
  },
}))
