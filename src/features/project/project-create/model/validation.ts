import { z } from 'zod'

/**
 * Project creation form validation schema
 */
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Please enter a project name')
    .max(50, 'Project name must be 50 characters or less')
    .regex(
      /^[a-zA-Z0-9가-힣\s\-_]+$/,
      'Project name cannot contain special characters',
    )
    .trim(), // Remove leading/trailing whitespace
  description: z
    .string()
    .max(100, 'Description must be 100 characters or less')
    .trim() // Remove leading/trailing whitespace
    .optional()
    .or(z.literal('')), // Allow empty string
})

export type CreateProjectFormData = z.infer<typeof createProjectSchema>
