import { File, Folder } from 'lucide-react'
import type React from 'react'
import { FaJava } from 'react-icons/fa'
import {
  SiCss3,
  SiHtml5,
  SiJavascript,
  SiJson,
  SiMarkdown,
  SiPython,
  SiTypescript,
} from 'react-icons/si'

/**
 * 단순화된 파일 아이콘 시스템
 * 주요 프로그래밍 언어와 기본 파일 타입만 지원
 */
export const getFileIcon = (
  fileName: string,
  size = 14,
): React.ReactElement => {
  const extension = fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    // 주요 프로그래밍 언어
    case 'js':
    case 'jsx':
      return <SiJavascript size={size} color="#f7df1e" />
    case 'ts':
    case 'tsx':
      return <SiTypescript size={size} color="#3178c6" />
    case 'py':
      return <SiPython size={size} color="#3776ab" />
    case 'java':
      return <FaJava size={size} color="#ed8b00" />
    case 'html':
    case 'htm':
      return <SiHtml5 size={size} color="#e34f26" />
    case 'css':
      return <SiCss3 size={size} color="#1572b6" />
    case 'json':
      return <SiJson size={size} color="#000000" />
    case 'md':
      return <SiMarkdown size={size} color="#000000" />

    // 기본 파일
    default:
      return <File size={size} className="text-gray-500" />
  }
}

/**
 * 폴더 아이콘 반환 함수
 */
export const getFolderIcon = (
  isExpanded: boolean,
  size = 14,
): React.ReactElement => {
  return (
    <Folder
      size={size}
      className={isExpanded ? 'text-blue-600' : 'text-blue-500'}
    />
  )
}
