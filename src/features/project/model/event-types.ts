export type ProjectClickHandler = (projectId: string) => void

export type ProjectActionHandler = (action: string, projectId: string) => void

export type CreateProjectHandler = (data: {
  name: string
  description: string
}) => void

export type ViewAllHandler = (section: 'host' | 'invited') => void
