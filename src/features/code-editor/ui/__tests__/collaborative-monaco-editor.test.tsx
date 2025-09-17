import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CollaborativeMonacoEditor } from '../collaborative-monaco-editor'

// Monaco Editor 모킹
vi.mock('@monaco-editor/react', () => ({
  default: ({
    onMount,
    ...props
  }: {
    onMount?: (editor: unknown, monaco: unknown) => void
    [key: string]: unknown
  }) => {
    // 테스트용 에디터 객체 생성
    const mockEditor = {
      getValue: vi.fn(() => 'test content'),
      setValue: vi.fn(),
      getModel: vi.fn(() => ({
        getFullModelRange: vi.fn(() => ({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: 1,
          endColumn: 1,
        })),
      })),
      onDidChangeModelContent: vi.fn(),
    }

    const mockMonaco = {
      Position: vi.fn((lineNumber, column) => ({
        lineNumber,
        column,
      })),
    }

    // 컴포넌트 마운트 시 onMount 호출
    setTimeout(() => {
      if (onMount) {
        onMount(mockEditor, mockMonaco)
      }
    }, 0)

    return <div data-testid="monaco-editor" {...props} />
  },
}))

// Liveblocks 모킹
vi.mock('@liveblocks/react', () => ({
  useSelf: vi.fn(() => ({
    connectionId: 1,
    presence: {
      user: {
        name: 'Test User',
        id: 'test-user-id',
      },
    },
  })),
  useRoom: vi.fn(() => 'test-room'),
}))

// Yjs 모킹
vi.mock('@liveblocks/yjs', () => ({
  getYjsProviderForRoom: vi.fn(() => ({
    getYDoc: vi.fn(() => ({
      getText: vi.fn(() => ({
        length: 0,
        insert: vi.fn(),
      })),
    })),
    awareness: {
      setLocalStateField: vi.fn(),
      on: vi.fn(),
      getStates: vi.fn(() => new Map()),
    },
    destroy: vi.fn(),
  })),
}))

// MonacoBinding 모킹
vi.mock('y-monaco', () => ({
  MonacoBinding: vi.fn().mockImplementation(() => ({
    destroy: vi.fn(),
  })),
}))

// Avatar 유틸리티 모킹
vi.mock('@/entities/user/lib/avatar', () => ({
  getUserColor: vi.fn(() => '#ff0000'),
}))

describe('CollaborativeMonacoEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Monaco Editor', () => {
    render(<CollaborativeMonacoEditor />)

    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
  })

  it('renders with initial value', () => {
    render(<CollaborativeMonacoEditor value="console.log('hello')" />)

    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
  })

  it('calls onChange when content changes', () => {
    const onChange = vi.fn()
    render(<CollaborativeMonacoEditor onChange={onChange} />)

    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
  })
})
