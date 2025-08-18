import type { CodeLink } from './../model/types'
import type {
  ChatMessage,
  MessagePart,
  ParsedChatMessage,
} from '../model/types'

/**
 * 파일 링크를 찾기 위한 정규식 패턴
 *
 * 형식: [파일명:라인번호](URL)
 * 예시: [Button.tsx:25](https://.../Button.tsx#L25)
 */
const FILE_LINK_PATTERN = /\[([^:]+):(\d+)\]\(([^)]+)\)/g
const FILE_LINK_SINGLE_PATTERN = /^\[([^:]+):(\d+)\]\(([^)]+)\)$/

/**
 * 파일 링크를 파싱하는 함수
 *
 * 링크 텍스트에서 파일명, 라인 번호, URL을 추출합니다.
 *
 * @param linkText - 파싱할 링크 텍스트 (예: "[파일명:라인번호](URL)")
 * @returns 파싱된 링크 정보 또는 null (파싱 실패 시)
 */
export const parseFileLink = (
  linkText: string,
): {
  fileName: string
  lineNumber: number
  url: string
} | null => {
  const singleLinkMatch = linkText.match(FILE_LINK_SINGLE_PATTERN)
  if (!singleLinkMatch) return null

  const [, fileName, lineNumberStr, url] = singleLinkMatch
  if (!fileName || !lineNumberStr || !url) {
    return null
  }

  const lineNumber = parseInt(lineNumberStr, 10)
  if (Number.isNaN(lineNumber)) {
    return null
  }

  return { fileName, lineNumber, url }
}

/**
 * 파일 링크를 생성하는 함수
 *
 * 파일명, 라인 번호, URL을 받아서 파일 링크 텍스트를 생성합니다.
 *
 * @param fileName - 파일명
 * @param lineNumber - 라인 번호
 * @param url - 파일 URL
 * @returns 생성된 링크 텍스트
 */
export const generateFileLink = (
  fileName: string,
  lineNumber: number,
  url: string,
): string => {
  return `[${fileName}:${lineNumber}](${url})`
}

/**
 * 링크가 유효한지 검증하는 함수
 *
 * 링크 텍스트가 올바른 파일 링크 형식인지 확인합니다.
 *
 * @param linkText - 검증할 링크 텍스트
 * @returns 유효성 여부
 */
export const isValidFileLink = (linkText: string): boolean => {
  return parseFileLink(linkText) !== null
}

/**
 * 링크 매치를 MessagePart로 변환하는 함수
 */
const createLinkPart = (match: RegExpMatchArray): MessagePart | null => {
  const [, fileName, lineNumberStr, url] = match

  if (!fileName || !lineNumberStr || !url) {
    return null
  }

  const lineNumber = parseInt(lineNumberStr, 10)
  if (Number.isNaN(lineNumber)) {
    return null
  }

  return {
    originalText: match[0],
    displayText: `${fileName}:${lineNumber}`,
    link: { fileName, lineNumber, url },
  }
}

/**
 * 일반 텍스트를 MessagePart로 변환하는 함수
 */
const createTextPart = (text: string): MessagePart => ({
  originalText: text,
  displayText: text,
})

/**
 * 링크 이전의 텍스트를 처리하는 함수
 */
const processTextBeforeLink = (
  text: string,
  lastIndex: number,
  matchIndex: number,
  parts: MessagePart[],
): void => {
  if (matchIndex > lastIndex) {
    const textBefore = text.slice(lastIndex, matchIndex)
    parts.push(createTextPart(textBefore))
  }
}

/**
 * 링크 매치를 처리하는 함수
 */
const processLinkMatch = (
  match: RegExpMatchArray,
  parts: MessagePart[],
): void => {
  const linkPart = createLinkPart(match)
  if (linkPart) {
    parts.push(linkPart)
  }
}

/**
 * 링크 이후의 텍스트를 처리하는 함수
 */
const processTextAfterLinks = (
  text: string,
  lastIndex: number,
  parts: MessagePart[],
): void => {
  if (lastIndex < text.length) {
    const textAfter = text.slice(lastIndex)
    parts.push(createTextPart(textAfter))
  }
}

/**
 * 텍스트를 메시지 파트로 분해하는 함수
 *
 * 텍스트에서 파일 링크를 찾아서 텍스트와 링크를 분리합니다.
 * 링크가 없는 경우 전체 텍스트를 하나의 파트로 처리합니다.
 *
 * @param text - 파싱할 텍스트
 * @returns 메시지 파트 배열 (텍스트 또는 링크)
 */
const parseMessageParts = (text: string): MessagePart[] => {
  const parts: MessagePart[] = []
  let lastIndex = 0

  // 모든 링크 매치를 찾아서 순서대로 처리
  for (const match of text.matchAll(FILE_LINK_PATTERN)) {
    const matchIndex = match.index
    if (matchIndex === undefined) continue

    // 링크 이전의 텍스트 처리
    processTextBeforeLink(text, lastIndex, matchIndex, parts)

    // 링크 처리
    processLinkMatch(match, parts)

    lastIndex = matchIndex + match[0].length
  }

  // 마지막 링크 이후의 텍스트 처리
  processTextAfterLinks(text, lastIndex, parts)

  // 파트가 없다면 전체를 텍스트로 처리
  if (parts.length === 0) {
    parts.push(createTextPart(text))
  }

  return parts
}

/**
 * 링크가 있는 파트만 필터링하는 함수
 */
const hasLink = (
  part: MessagePart,
): part is MessagePart & { link: NonNullable<MessagePart['link']> } => {
  return part.link !== undefined
}

/**
 * ChatMessage를 ParsedChatMessage로 변환하는 함수
 *
 * 원본 메시지에 파싱된 파트와 링크 정보를 추가합니다.
 *
 * @param msg - 변환할 ChatMessage
 * @returns 파싱된 채팅 메시지 (ParsedChatMessage)
 */
export const toParsedChatMessage = (msg: ChatMessage): ParsedChatMessage => {
  const parts: MessagePart[] = parseMessageParts(msg.content)
  const links: CodeLink[] = parts.filter(hasLink).map(part => ({
    fileName: part.link.fileName,
    lineNumber: part.link.lineNumber,
    url: part.link.url,
  }))

  return {
    ...msg,
    parts,
    links,
  }
}

/**
 * 여러 메시지를 한번에 파싱하는 함수
 *
 * ChatMessage 배열을 받아서 ParsedChatMessage 배열로 변환합니다.
 *
 * @param messages - 파싱할 메시지 배열
 * @returns 파싱된 메시지 배열
 */
export const parseChatMessages = (
  messages: ChatMessage[],
): ParsedChatMessage[] => {
  return messages.map(toParsedChatMessage)
}
