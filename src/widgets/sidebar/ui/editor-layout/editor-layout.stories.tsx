import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useEffect } from 'react'
import { useLayoutStore } from '../../store/layout-store'
import EditorLayout from './editor-layout'

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
    const { setLayout } = useLayoutStore()

    useEffect(() => {
      setLayout('primary-left')
    }, [setLayout])

    return (
      <EditorLayout>
        <h1 className="flex justify-center">Main Area</h1>
      </EditorLayout>
    )
  },
}

// EditorLayout (Primary Right)
export const PrimaryRight: Story = {
  render: () => {
    const { setLayout } = useLayoutStore()

    useEffect(() => {
      setLayout('primary-right')
    }, [setLayout])

    return (
      <EditorLayout>
        <h1 className="flex justify-center">Main Area</h1>
      </EditorLayout>
    )
  },
}
