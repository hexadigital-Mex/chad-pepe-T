import { createChatHandler } from '../server/chatCore'

export default createChatHandler({
  apiKey: process.env.OPENAI_API_KEY ?? process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
  model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
})