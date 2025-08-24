import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useEffect } from 'react'
import { useLayoutStore } from '@/widgets/sidebar/model/store'
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

// EditorLayout (Primary Left)
export const PrimaryLeft: Story = {
  render: () => {
    const { setPosition } = useLayoutStore()

    useEffect(() => {
      setPosition('left')
    }, [setPosition])

    return (
      <EditorLayout>
        <h1 className="flex h-full items-center justify-center">Main Area</h1>
      </EditorLayout>
    )
  },
}

// EditorLayout (Primary Right)
export const PrimaryRight: Story = {
  render: () => {
    const { setPosition } = useLayoutStore()

    useEffect(() => {
      setPosition('right')
    }, [setPosition])

    return (
      <EditorLayout>
        <h1 className="flex h-full items-center justify-center">Main Area</h1>
      </EditorLayout>
    )
  },
}
