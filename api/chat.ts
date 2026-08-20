import { createChatHandler, resolveChatConfig } from '../server/chatCore.ts'

export default createChatHandler(resolveChatConfig(process.env))