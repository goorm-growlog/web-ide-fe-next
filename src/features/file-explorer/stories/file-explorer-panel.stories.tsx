import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import FileExplorerPanel from '@/features/file-explorer/ui/file-explorer-panel'

const meta: Meta<typeof FileExplorerPanel> = {
  title: 'Features/FileExplorerPanel',
  component: FileExplorerPanel,
  parameters: {
    layout: 'centered',
  },
  args: {
    rootItemId: '/',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomIndent: Story = {
  args: {
    rootItemId: '/',
  },
}

export const CustomRoot: Story = {
  args: {
    rootItemId: '/src',
  },
}

// 스크롤 테스트를 위한 새로운 stories
export const WithLongFileNames: Story = {
  args: {
    rootItemId: '/',
  },
  parameters: {
    docs: {
      description: {
        story:
          '긴 파일명과 폴더명을 가진 데이터로 가로 스크롤 동작을 테스트합니다.',
      },
    },
  },
}

export const InNarrowContainer: Story = {
  args: {
    rootItemId: '/',
  },
  decorators: [
    Story => (
      <div className="h-96 w-64 overflow-hidden rounded-lg border border-gray-300">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: '좁은 컨테이너(256px)에서 가로/세로 스크롤 동작을 테스트합니다.',
      },
    },
  },
}

export const InVeryNarrowContainer: Story = {
  args: {
    rootItemId: '/',
  },
  decorators: [
    Story => (
      <div className="h-96 w-48 overflow-hidden rounded-lg border border-gray-300">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          '매우 좁은 컨테이너(192px)에서 가로 스크롤이 필수적인 상황을 테스트합니다.',
      },
    },
  },
}

export const InWideContainer: Story = {
  args: {
    rootItemId: '/',
  },
  decorators: [
    Story => (
      <div className="h-96 w-96 overflow-hidden rounded-lg border border-gray-300">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          '넓은 컨테이너(384px)에서도 스크롤이 정상적으로 작동하는지 테스트합니다.',
      },
    },
  },
}

export const WithManyFiles: Story = {
  args: {
    rootItemId: '/',
  },
  decorators: [
    Story => (
      <div className="h-64 w-80 overflow-hidden rounded-lg border border-gray-300">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: '많은 파일과 폴더가 있을 때 세로 스크롤 동작을 테스트합니다.',
      },
    },
  },
}

export const SidebarSimulation: Story = {
  args: {
    rootItemId: '/',
  },
  decorators: [
    Story => (
      <div className="flex h-screen w-screen bg-gray-100">
        {/* 실제 사이드바와 유사한 레이아웃 */}
        <div className="flex h-full w-80 flex-col border-gray-200 border-r bg-white">
          <div className="flex h-12 items-center border-gray-200 border-b bg-gray-50 px-4">
            <h2 className="font-medium text-gray-700 text-sm">Files</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <Story />
          </div>
        </div>
        <div className="flex-1 p-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-medium text-lg">Main Content Area</h3>
            <p className="text-gray-600">
              이 영역은 메인 콘텐츠를 시뮬레이션합니다. 왼쪽 사이드바에서
              FileExplorerPanel의 스크롤 동작을 테스트할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          '실제 사이드바 환경과 유사한 레이아웃에서 스크롤 동작을 테스트합니다.',
      },
    },
  },
}

export const ResizableContainer: Story = {
  args: {
    rootItemId: '/',
  },
  decorators: [
    Story => (
      <div className="h-96 w-full overflow-hidden rounded-lg border border-gray-300">
        <div className="flex h-8 items-center border-gray-200 border-b bg-gray-50 px-4">
          <span className="text-gray-500 text-xs">
            컨테이너 너비를 조절하여 스크롤 동작을 테스트하세요
          </span>
        </div>
        <div className="h-full overflow-hidden">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          '브라우저 개발자 도구로 컨테이너 너비를 조절하여 다양한 크기에서의 스크롤 동작을 테스트합니다.',
      },
    },
  },
}
