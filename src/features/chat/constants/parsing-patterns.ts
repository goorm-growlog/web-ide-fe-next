/**
 * 파일 링크 파싱을 위한 정규식 패턴들
 */

/**
 * 파일 링크를 찾기 위한 정규식 패턴
 *
 * 형식: [파일명:라인번호](URL)
 * 예시: [Button.tsx:25](https://.../Button.tsx#L25)
 */
export const FILE_LINK_PATTERN = /\[([^:]+):(\d+)\]\(([^)]+)\)/g

/**
 * 단일 파일 링크를 파싱하는 정규식 패턴
 */
export const SINGLE_FILE_LINK_PATTERN = /^\[([^:]+):(\d+)\]\(([^)]+)\)$/
