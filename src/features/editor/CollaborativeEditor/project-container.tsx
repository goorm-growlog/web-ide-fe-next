'use client'

import type { ReactNode } from 'react'
import { FileSelector } from './file-selector'

// projectId를 props로 받도록 수정
const ProjectContainer = ({
  projectId,
  children,
}: {
  projectId: string
  children: ReactNode
}) => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <FileSelector projectId={projectId} />
      <main style={{ flex: 1, position: 'relative' }}>{children}</main>
    </div>
  )
}

export { ProjectContainer }
