import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function ProjectLayout({ children }: LayoutProps) {
  return children
}
