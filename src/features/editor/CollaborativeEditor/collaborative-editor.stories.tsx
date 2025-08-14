import { Editor } from '@monaco-editor/react'
import type { Meta, StoryObj } from '@storybook/nextjs'

const meta = {
  title: 'Features/Editor/CollaborativeEditor',
  component: () => null,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={{ height: '600px', width: '100%', position: 'relative' }}>
      <Editor
        height="100%"
        width="100%"
        theme="vs-dark"
        defaultLanguage="javascript"
        defaultValue="// Welcome to Monaco Editor\nconsole.log('Hello World!');"
        options={{ automaticLayout: true }}
      />
    </div>
  ),
}

export const LightTheme: Story = {
  render: () => (
    <div style={{ height: '600px', width: '100%', position: 'relative' }}>
      <Editor
        height="100%"
        width="100%"
        theme="light"
        defaultLanguage="javascript"
        defaultValue="// Light theme editor\nfunction hello() {\n  return 'Hello World!';\n}"
        options={{ automaticLayout: true }}
      />
    </div>
  ),
}

export const TypeScript: Story = {
  render: () => (
    <div style={{ height: '600px', width: '100%', position: 'relative' }}>
      <Editor
        height="100%"
        width="100%"
        theme="vs-dark"
        defaultLanguage="typescript"
        defaultValue="interface User {\n  id: number;\n  name: string;\n}\n\nconst user: User = {\n  id: 1,\n  name: 'John Doe'\n};"
        options={{ automaticLayout: true }}
      />
    </div>
  ),
}
