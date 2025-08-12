import type { ReactNode } from 'react'

const EditorLayout = ({ children }: { children: ReactNode }) => (
  <div>
    <header>Editor Layout</header>
    <main>{children}</main>
  </div>
)

export default EditorLayout
