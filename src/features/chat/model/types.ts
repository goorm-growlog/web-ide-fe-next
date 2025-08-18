export interface ChatMessage {
  projectId: number
  messageType: 'ENTER' | 'TALK' | 'LEAVE'
  userId: number
  username: string
  content: string
  sentAt: string
}

export interface CodeLink {
  fileName: string
  lineNumber: number
  url: string
}

export type MessagePart = {
  originalText: string
  displayText?: string
  link?: CodeLink
}

export interface ParsedChatMessage extends ChatMessage {
  parts: MessagePart[]
  links: CodeLink[]
}
