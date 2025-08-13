import type { Meta, StoryObj } from '@storybook/nextjs'
import { Accordion } from '@/shared/ui/shadcn/accordion'
import TogglePanel from './toggle-panel'

const meta = {
  title: 'Shared/TogglePanel',
  component: TogglePanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description:
        'Panel title that appears in the accordion trigger. Also used as the unique identifier for the accordion item (value).',
    },
    children: {
      control: false,
      description: 'Content to display inside the collapsible panel',
    },
  },
} satisfies Meta<typeof TogglePanel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <Accordion style={{ width: '20vw', height: '100%' }} type="multiple">
      <TogglePanel {...args} />
    </Accordion>
  ),
  args: {
    title: '패널 제목',
    children: (
      <div>
        <strong>패널 내용</strong>을 자유롭게 넣을 수 있습니다.
        <br />
        예시: <code>children</code>으로 원하는 컴포넌트/텍스트 전달
      </div>
    ),
  },
}
