import { FILE_LINK_PATTERN } from '@/features/chat/constants/file-link-patterns'
import type { CodeLink, MessagePart } from '@/features/chat/types/client'

/**
 * 파일명과 라인번호를 표준 형식으로 포맷팅
 */
const formatCodeLinkText = (fileName: string, lineNumber: number): string => {
  return `${fileName}:${lineNumber}`
}

/**
 * 정규식 매치에서 CodeLink 생성
 */
const createCodeLink = (match: RegExpMatchArray): CodeLink | null => {
  const [, fileName, lineNumberStr, url] = match

  if (!fileName || !lineNumberStr || !url) return null

  const lineNumber = parseInt(lineNumberStr, 10)
  if (Number.isNaN(lineNumber) || lineNumber < 1) return null

  return { fileName, lineNumber, url }
}

/**
 * 링크 매치를 MessagePart로 변환
 */
const createLinkPart = (match: RegExpMatchArray): MessagePart | null => {
  const codeLink = createCodeLink(match)
  if (!codeLink) return null

  return {
    text: formatCodeLinkText(codeLink.fileName, codeLink.lineNumber),
    codeLink,
  }
}

/**
 * 텍스트에서 코드 링크를 파싱하여 MessagePart 배열로 변환
 *
 * @param content - 파싱할 텍스트
 * @returns 메시지 파트 배열 (텍스트 또는 링크)
 */
export const parseChatMessage = (content: string): MessagePart[] => {
  const parts: MessagePart[] = []
  let lastIndex = 0

  for (const match of content.matchAll(FILE_LINK_PATTERN)) {
    const matchIndex = match.index
    if (matchIndex === undefined) continue

    // 링크 앞의 텍스트 추가
    if (matchIndex > lastIndex) {
      parts.push({ text: content.slice(lastIndex, matchIndex) })
    }

    // 링크 부분 추가
    const linkPart = createLinkPart(match)
    if (linkPart) parts.push(linkPart)
    lastIndex = matchIndex + match[0].length
  }

  // 마지막 남은 텍스트 추가
  if (lastIndex < content.length) {
    parts.push({ text: content.slice(lastIndex) })
  }

  // 파트가 없으면 전체를 텍스트로 처리
  if (parts.length === 0) {
    parts.push({ text: content })
  }

  return parts
}

/**
 * MessagePart에서 표시용 텍스트 추출
 */
export const getPartText = (part: MessagePart): string => {
  return part.codeLink
    ? formatCodeLinkText(part.codeLink.fileName, part.codeLink.lineNumber)
    : part.text
}
