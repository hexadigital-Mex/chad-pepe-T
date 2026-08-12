import { loadEnv } from 'vite'
import { createChatHandler } from './chatCore'

const env: Record<string, string> = loadEnv('development', process.cwd(), '')

export const chatHandler = createChatHandler({
  apiKey: env.OPENAI_API_KEY ?? env.OPENROUTER_API_KEY,
  baseURL: env.OPENAI_BASE_URL,
  model: env.OPENAI_MODEL ?? 'gpt-4o-mini',
})
