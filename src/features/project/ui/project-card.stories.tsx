import type { Meta, StoryObj } from '@storybook/react'
import type { Project } from '../model/types'
import ProjectCard from './project-card'

const meta: Meta<typeof ProjectCard> = {
  title: 'Features/Project/ProjectCard',
  component: ProjectCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// 샘플 프로젝트 데이터
const sampleProject: Project = {
  projectId: 1,
  projectName: 'webide-project',
  description: 'Java 기반 테스트용',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ownerId: 1,
  ownerName: '홍길동',
  ownerEmail: 'hong@example.com',
  ownerProfileImageUrl: undefined,
  memberCount: 5,
  isOwner: true,
  isInvited: false,
}

const invitedProject: Project = {
  ...sampleProject,
  projectId: 2,
  projectName: 'team-project',
  description: '팀 협업 프로젝트',
  isOwner: false,
  isInvited: true,
  memberCount: 3,
}

export const Default: Story = {
  args: {
    project: sampleProject,
  },
}

export const InvitedProject: Story = {
  args: {
    project: invitedProject,
  },
}

export const WithManyMembers: Story = {
  args: {
    project: {
      ...sampleProject,
      memberCount: 8,
    },
  },
}

export const WithLongDescription: Story = {
  args: {
    project: {
      ...sampleProject,
      description:
        '매우 긴 설명이 있는 프로젝트입니다. 이 설명은 두 줄로 표시되어야 합니다.',
    },
  },
}

export const WithLongName: Story = {
  args: {
    project: {
      ...sampleProject,
      projectName: 'very-long-project-name-that-should-be-truncated',
    },
  },
}

export const Interactive: Story = {
  args: {
    project: sampleProject,
    onClick: project => {
      console.log('Project clicked:', project)
    },
    onMoreClick: project => {
      console.log('More clicked:', project)
    },
  },
}
