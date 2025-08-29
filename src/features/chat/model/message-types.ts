export const MESSAGE_TYPES = {
  ENTER: 'ENTER',
  LEAVE: 'LEAVE',
  TALK: 'TALK',
} as const

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES]

export type SystemMessageType = Extract<MessageType, 'ENTER' | 'LEAVE'>

export type TalkMessageType = Extract<MessageType, 'TALK'>

export interface Message {
  messageType: MessageType
  userId: number
  username: string
  content: string
  sentAt: string
}

export interface SystemMessage extends Message {
  messageType: SystemMessageType
}

export interface TalkMessage extends Message {
  messageType: TalkMessageType
}
