'use client'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ projectId: string }>
}

/**
 * 프로젝트 레이아웃 컴포넌트
 *
 * 책임:
 * - 기본 레이아웃 구조 제공
 */
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      {children}
    </div>
  )
}

export default Layout
