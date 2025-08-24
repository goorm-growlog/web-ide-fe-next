/**
 * 파일 링크를 찾기 위한 정규식 패턴
 *
 * 형식: [파일명:라인번호](URL)
 * 예시: [Button.tsx:25](https://github.com/owner/repo/blob/main/src/components/Button.tsx#L25)
 */
export const FILE_LINK_PATTERN = /\[([^:]+):(\d+)\]\(([^)]+)\)/g
