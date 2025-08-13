// 파일의 고유 정보
export interface FileMetadata {
  id: string // 고유 식별자 (UUID 등 현재는 아마 숫자 1부터 증가로 되어있을 것)
  filepath: string // "src/components/Button.tsx" 와 같은 전체 경로
}
