export interface ChatMessage {
  projectId: number
  messageType: 'ENTER' | 'TALK' | 'LEAVE'
  userId: number
  username: string
  content: string
  sentAt: string
}
