import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FileText, Search, Settings, Terminal, User } from 'lucide-react'
import { fn } from 'storybook/test'

import IconButton from './icon-button'

const meta = {
  title: 'Features/Sidebar/TabButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    Icon: {
      control: false,
      description: 'Lucide React icon component',
    },
    isSelected: {
      control: 'boolean',
      description: 'Whether the tab button is selected',
    },
    onClick: {
      control: false,
      description: 'Click handler function',
    },
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
  args: {
    onClick: fn(),
    Icon: FileText,
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    Icon: FileText,
    isSelected: false,
  },
}

export const Selected: Story = {
  args: {
    Icon: FileText,
    isSelected: true,
  },
}

// Size examples
export const SizeGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <IconButton Icon={Terminal} onClick={fn()} size={'icon'} />
      <IconButton Icon={Terminal} onClick={fn()} size={'sm'} />
      <IconButton Icon={Terminal} onClick={fn()} size={'default'} />
      <IconButton Icon={Terminal} onClick={fn()} size={'lg'} />
    </div>
  ),
}

// Interactive examples
export const InteractiveGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <IconButton Icon={FileText} onClick={fn()} isSelected={true} />
      <IconButton Icon={Search} onClick={fn()} isSelected={false} />
      <IconButton Icon={Settings} onClick={fn()} isSelected={false} />
      <IconButton Icon={User} onClick={fn()} isSelected={false} />
    </div>
  ),
}
