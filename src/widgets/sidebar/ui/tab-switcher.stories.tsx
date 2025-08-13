import type { Meta, StoryObj } from '@storybook/nextjs'
import {
  FilesIcon,
  FolderInputIcon,
  SearchIcon,
  SettingsIcon,
  Share2Icon,
} from 'lucide-react'
import { fn } from 'storybook/test'
import IconButton from '@/shared/ui/icon-button'
import TabSwitcher from './tab-switcher'

const meta = {
  title: 'Widgets/Sidebar/TabSwitcher',
  component: TabSwitcher,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    topTaps: {
      control: false,
      description: 'Array of IconButton elements to render at the top',
    },
    bottomTaps: {
      control: false,
      description: 'Array of IconButton elements to render at the bottom',
    },
  },
  args: {
    topTaps: [
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
    bottomTaps: [
      <IconButton
        key="setting"
        Icon={SettingsIcon}
        aria-label="Settings"
        onClick={fn()}
      />,
    ],
  },
} satisfies Meta<typeof TabSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
