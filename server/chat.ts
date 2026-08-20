import { loadEnv } from 'vite'
import { createChatHandler, resolveChatConfig } from './chatCore.ts'

const env = loadEnv('development', process.cwd(), '')

export const chatHandler = createChatHandler(resolveChatConfig(env))