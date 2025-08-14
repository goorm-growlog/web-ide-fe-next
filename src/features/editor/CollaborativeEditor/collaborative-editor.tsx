'use client'

import { Editor } from '@monaco-editor/react'

const CollaborativeEditor = () => {
  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <Editor
        height="100%"
        width="100%"
        theme="vs-dark"
        options={{ automaticLayout: true }}
      />
    </div>
  )
}

export { CollaborativeEditor }
