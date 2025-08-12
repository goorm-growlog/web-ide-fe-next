import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  FilesIcon,
  FolderInputIcon,
  SearchIcon,
  SettingsIcon,
  Share2Icon,
} from 'lucide-react'
import { fn } from 'storybook/test'
import IconButton from '@/shared/ui/icon-button'
import Navigation from './navigation'

const meta = {
  title: 'Features/Sidebar/Navigation',
  component: Navigation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    topButtons: {
      control: false,
      description: 'Array of IconButton elements to render at the top',
    },
    bottomButtons: {
      control: false,
      description: 'Array of IconButton elements to render at the bottom',
    },
  },
  args: {
    topButtons: [
      <IconButton
        key="files"
        Icon={FilesIcon}
        aria-label="Files"
        isSelected
        onClick={fn()}
      />,
      <IconButton
        key="search"
        Icon={SearchIcon}
        aria-label="Search"
        onClick={fn()}
      />,
      <IconButton
        key="share"
        Icon={Share2Icon}
        aria-label="Share"
        onClick={fn()}
      />,
      <IconButton
        key="projects"
        Icon={FolderInputIcon}
        aria-label="Projects"
        onClick={fn()}
      />,
    ],
    bottomButtons: [
      <IconButton
        key="setting"
        Icon={SettingsIcon}
        aria-label="Settings"
        onClick={fn()}
      />,
    ],
  },
} satisfies Meta<typeof Navigation>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
