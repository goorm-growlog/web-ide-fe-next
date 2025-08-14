// 파일의 고유 정보
interface FileMetadata {
  id: string // 고유 식별자 (UUID 등)
  filepath: string // "src/components/Button.tsx" 와 같은 전체 경로
}

export type { FileMetadata }
