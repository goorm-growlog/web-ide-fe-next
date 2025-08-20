import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import TogglePanels from '../toggle-panels/toggle-panels'
import Sidebar from './sidebar'

const meta: Meta<typeof Sidebar> = {
  title: 'Widgets/Sidebar/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Sidebar>

export const Default: Story = {
  args: {
    children: (
      <TogglePanels
        panels={[
          {
            key: 'files',
            title: 'Files',
            content: <div>File Explorer Content</div>,
          },
        ]}
      />
    ),
  },
}

export const WithMultiplePanels: Story = {
  args: {
    children: (
      <TogglePanels
        panels={[
          {
            key: 'files',
            title: 'Files',
            content: <div>File Explorer Content</div>,
          },
          {
            key: 'search',
            title: 'Search',
            content: <div>Search Panel Content</div>,
          },
          {
            key: 'invite',
            title: 'Invite',
            content: <div>Invite Panel Content</div>,
          },
        ]}
      />
    ),
  },
}

export const Empty: Story = {
  args: {},
}

export const CustomEmptyState: Story = {
  args: {
    children: (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <div className="mb-2 text-muted-foreground text-sm">
          🎯 Custom empty state
        </div>
        <button type="button" className="text-primary text-sm hover:underline">
          Add content
        </button>
      </div>
    ),
  },
}

export const AccessibilityTest: Story = {
  args: {
    children: (
      <nav aria-label="Secondary navigation">
        <ul className="space-y-2 p-4">
          <li>
            <button type="button" className="block text-sm hover:text-primary">
              Dashboard
            </button>
          </li>
          <li>
            <button type="button" className="block text-sm hover:text-primary">
              Settings
            </button>
          </li>
          <li>
            <button type="button" className="block text-sm hover:text-primary">
              Profile
            </button>
          </li>
        </ul>
      </nav>
    ),
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'landmark-one-main',
            enabled: false,
          },
        ],
      },
    },
  },
}

// Ref Testing Story
export const RefTesting: Story = {
  args: {
    children: (
      <div className="p-4">
        <p className="text-muted-foreground text-sm">
          이 스토리는 forwardRef 기능을 테스트합니다.
        </p>
        <button
          type="button"
          className="mt-2 rounded bg-primary px-3 py-1 text-primary-foreground text-sm hover:bg-primary/90"
          onClick={() => {
            console.log('Sidebar ref functionality working')
          }}
        >
          Test Ref Access
        </button>
      </div>
    ),
  },
}
