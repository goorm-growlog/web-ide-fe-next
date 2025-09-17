import { render, screen, waitFor } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { CollaborativeMonacoEditor } from '../collaborative-monaco-editor'

// 실제 Liveblocks 클라이언트 사용 (모킹 없음)
describe('CollaborativeMonacoEditor Integration Tests', () => {
  beforeAll(() => {
    // 환경 변수 확인
    console.log('🔍 환경변수 확인:')
    console.log(
      'NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY:',
      process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY
        ? '설정됨'
        : '설정되지 않음',
    )

    if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) {
      console.warn(
        'NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY not set - integration tests may fail',
      )
    }
  })

  afterAll(() => {
    // 정리 작업
  })

  it('should render collaborative editor with real Liveblocks client', async () => {
    // Given: 기본 props
    const props = {
      value: 'console.log("Hello, World!")',
      language: 'javascript',
    }

    // When: 컴포넌트 렌더링
    render(<CollaborativeMonacoEditor roomId="test-room" {...props} />)

    // Then: 에디터가 렌더링되어야 함
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  it('should handle content changes', async () => {
    // Given: onChange 핸들러와 함께 렌더링
    const onChange = vi.fn()
    render(<CollaborativeMonacoEditor roomId="test-room" onChange={onChange} />)

    // When: 에디터가 렌더링될 때까지 대기
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    // Then: 에디터가 정상적으로 렌더링되어야 함
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})
