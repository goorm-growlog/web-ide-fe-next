export interface MessagePart {
  text: string
  codeLink?: CodeLink
}

export interface CodeLink {
  fileName: string
  lineNumber: number
  url: string
}
