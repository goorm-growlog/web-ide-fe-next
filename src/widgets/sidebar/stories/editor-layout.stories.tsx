/** biome-ignore-all lint/correctness/useExhaustiveDependencies: storybook only */
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useEffect } from 'react'
import { usePosition } from '@/widgets/sidebar/model/hooks'
import EditorLayout from '@/widgets/sidebar/ui/editor-layout'

const meta: Meta<typeof EditorLayout> = {
  title: 'Widgets/Sidebar/EditorLayout',
  component: EditorLayout,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof EditorLayout>

export const PrimaryLeft: Story = {
  render: () => {
    const { position, togglePosition } = usePosition()

    useEffect(() => {
      if (position !== 'left') {
        togglePosition()
      }
    }, [])

    return (
      <EditorLayout>
        <h1 className="flex h-full items-center justify-center">Main Area</h1>
      </EditorLayout>
    )
  },
}

export const PrimaryRight: Story = {
  render: () => {
    const { position, togglePosition } = usePosition()

    useEffect(() => {
      if (position !== 'right') {
        togglePosition()
      }
    }, [])

    return (
      <EditorLayout>
        <h1 className="flex h-full items-center justify-center">Main Area</h1>
      </EditorLayout>
    )
  },
}
