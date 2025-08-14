import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'

const meta = {
  title: 'Features/Editor/FileSelector',
  component: () => null,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const TabsDemo = ({ tabs }: { tabs: { id: string; name: string }[] }) => {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id)
  const [currentTabs, setCurrentTabs] = useState(tabs)

  const closeTab = (tabId: string) => {
    const newTabs = currentTabs.filter(tab => tab.id !== tabId)
    setCurrentTabs(newTabs)
    if (activeTabId === tabId && newTabs.length > 0) {
      setActiveTabId(newTabs[0]?.id)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.3125rem',
        borderBottom: '1px solid #333',
        backgroundColor: '#252526',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', flexGrow: 1 }}>
        {currentTabs.map(tab => {
          const isActive = tab.id === activeTabId
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 0.75rem',
                background: isActive ? '#1e1e1e' : 'transparent',
                borderRight: '1px solid #333',
                cursor: 'pointer',
                color: isActive ? 'white' : '#999',
                border: 'none',
              }}
            >
              <span>{tab.name}</span>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  closeTab(tab.id)
                }}
                style={{
                  marginLeft: '0.625rem',
                  border: 'none',
                  background: 'transparent',
                  color: '#999',
                  cursor: 'pointer',
                  padding: '0',
                  fontSize: '0.875rem',
                }}
              >
                ✕
              </button>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <TabsDemo
      tabs={[
        { id: '1', name: 'App.tsx' },
        { id: '2', name: 'index.js' },
        { id: '3', name: 'styles.css' },
      ]}
    />
  ),
}

export const SingleTab: Story = {
  render: () => <TabsDemo tabs={[{ id: '1', name: 'main.js' }]} />,
}

export const ManyTabs: Story = {
  render: () => (
    <TabsDemo
      tabs={[
        { id: '1', name: 'App.tsx' },
        { id: '2', name: 'index.js' },
        { id: '3', name: 'styles.css' },
        { id: '4', name: 'utils.ts' },
        { id: '5', name: 'config.json' },
        { id: '6', name: 'package.json' },
      ]}
    />
  ),
}
