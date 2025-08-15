import type { Meta, StoryObj } from '@storybook/react'
import type { Panel } from '../../model/types'
import { TogglePanels } from './toggle-panels'

const meta: Meta<typeof TogglePanels> = {
  title: 'Sidebar/TogglePanels',
  component: TogglePanels,
}
export default meta

type Story = StoryObj<typeof TogglePanels>

const panels: Panel[] = [
  {
    type: 'files',
    title: 'Files',
    content: <div>Content 1</div>,
  },
  {
    type: 'search',
    title: 'Search',
    content: <div>Content 2</div>,
  },
  {
    type: 'invite',
    title: 'Invite',
    content: <div>Content 3</div>,
  },
]

export const Default: Story = {
  render: () => {
    return (
      <div
        style={{
          height: '50vh',
          display: 'flex',
        }}
      >
        <TogglePanels panels={panels} />
      </div>
    )
  },
}
