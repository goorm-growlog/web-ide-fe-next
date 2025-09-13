# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (uses Turbopack for faster builds)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint` (using Biome)
- **Fix lint issues**: `npm run lint:fix`
- **Format code**: `npm run format`
- **Type check**: `pnpm exec tsc --noEmit`
- **Storybook development**: `npm run storybook`
- **Build Storybook**: `npm run build-storybook`

## Code Quality & Git Hooks

This project uses **Lefthook** for Git hooks with strict quality controls:

- **Pre-commit**: Auto-fixes code with Biome linter/formatter, stages fixed files
- **Pre-push**: Runs lint checks and TypeScript type checking (both must pass)
- **Commit-msg**: Enforces Conventional Commits format with commitlint

**Biome** is used instead of ESLint/Prettier with comprehensive rules including:
- Korean comments explaining enhanced TypeScript settings  
- A11y, performance, Next.js, and nursery rules enabled
- Strict naming conventions (kebab-case for files) and import organization
- 80-character line width, single quotes, trailing commas

## Architecture & Structure

This is a **Next.js 15 + React 19** project following **Feature-Sliced Design (FSD)** architecture:

```
src/
├── app/              # Next.js App Router pages
├── entities/         # Core business entities (chats, files, projects, users)
├── features/         # Feature-specific components and logic
│   ├── chat/         # Chat functionality with message parsing and file links
│   ├── file-explorer/ # File tree with DnD, rename, and drop handlers
│   └── [others]/     # invite, members, search, voice-chats
├── shared/           # Reusable utilities and UI components
│   ├── lib/          # Utilities (date, scroll, string, etc.)
│   └── ui/           # UI components (shadcn/ui + custom)
└── widgets/          # Complex UI compositions
    └── sidebar/      # Sidebar with tab switching and panels
```

## Key Technologies & Patterns

- **UI Components**: Radix UI primitives + shadcn/ui components + Tailwind CSS
- **State Management**: React 19 hooks and context + Zustand for complex state
- **Tree Components**: Uses `@headless-tree/react` for file explorer
- **Styling**: CSS Modules alongside Tailwind for component-specific styles
- **Icons**: Lucide React icon library
- **Development**: Storybook for component development with a11y addon
- **Testing**: Playwright for end-to-end testing

## TypeScript Configuration

Enhanced TypeScript settings with:
- `noUncheckedIndexedAccess: true` - Safer array/object access
- `exactOptionalPropertyTypes: true` - Stricter optional property handling
- Path mapping: `@/*` → `./src/*`

## File Naming & Conventions

- **Files**: kebab-case recommended by Biome config
- **Components**: PascalCase for React components
- **Functions/Variables**: camelCase, PascalCase, or CONSTANT_CASE
- **CSS Modules**: `.module.css` suffix for component-specific styles
- **Storybook**: `.stories.tsx` suffix for component stories

## Import & Type Organization Rules

### **Import Path Rules**
- **✅ Use Alias Paths Only**: All imports must use `@/` alias paths
- **❌ Avoid Relative Paths**: Never use `./` or `../` for imports within the project

**Examples:**
```typescript
// Good - Always use alias paths
import { Button } from '@/shared/ui/shadcn/button'
import { useFileTreeState } from '@/features/file-explorer/hooks/use-file-tree-state'
import type { FileNode } from '@/features/file-explorer/model/types'

// Avoid - Never use relative paths
import { Button } from '../../../shared/ui/shadcn/button'
import { useFileTreeState } from './use-file-tree-state'
import type { FileNode } from '../model/types'
```

### **Type & Interface Organization**
- **✅ Separate Type Files**: All types and interfaces must be in separate `.types.ts` files
- **✅ Type File Naming**: Use same name as implementation file with `.types.ts` suffix
- **✅ Import Types from Type Files**: Implementation files import types from corresponding `.types.ts` files

**File Structure:**
```
hooks/
├── use-file-tree-state.ts          # Implementation
├── use-file-tree-state.types.ts     # Types/interfaces
├── use-tree-data-loader.ts          # Implementation
├── use-tree-data-loader.types.ts     # Types/interfaces
└── ...
```

**Examples:**
```typescript
// use-file-tree-state.types.ts
export interface FileTreeState {
  readonly flatFileNodes: Record<string, FileNode> | null
  readonly isLoading: boolean
  // ...
}

// use-file-tree-state.ts
import type { FileTreeState } from '@/features/file-explorer/hooks/use-file-tree-state.types'

export const useFileTreeState = (): FileTreeState => {
  // Implementation
}
```

### **Import Organization**
- **Group 1**: Third-party imports (react, next, etc.)
- **Group 2**: Project alias imports (`@/features/...`, `@/shared/...`)
- **Group 3**: Type-only imports (import type)
- **Group 4**: Relative imports (only for same-directory types)

**Example:**
```typescript
import { useState, useEffect } from 'react'
import { useTree } from '@headless-tree/react'
import { Button } from '@/shared/ui/shadcn/button'
import { useFileTreeState } from '@/features/file-explorer/hooks/use-file-tree-state'
import type { FileNode } from '@/features/file-explorer/model/types'
import type { FileTreeState } from '@/features/file-explorer/hooks/use-file-tree-state.types'
```

## Chat Feature Specifics

The chat feature includes:
- Message parsing with GitHub-style file links (`fileName:lineNumber`)
- Auto-scroll behavior with scroll restoration
- Support for ENTER/TALK/LEAVE message types
- File URL parsing and link generation

## File Explorer Features

- Drag & drop file handling with `drop-handler.ts`
- In-place file/folder renaming with `rename-handler.ts`
- Tree structure using headless-tree library
- Context menu support via Radix UI

## Development Rules & Patterns

Based on Cursor rules, follow these key principles:
- **Readability**: Use named constants for magic numbers, abstract complex logic into dedicated components
- **Predictability**: Standardize return types for similar functions, avoid hidden side effects  
- **Cohesion**: Organize code by feature/domain, keep related logic together
- **Coupling**: Prefer composition over prop drilling, scope state management appropriately

## 🎯 TypeScript & Code Style Standards

### **Function Patterns**
**✅ Use Arrow Functions Exclusively**
```typescript
// Good
const handleSubmit = (event: FormEvent) => {
  event.preventDefault()
  // Logic
}

const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// Exception: Class methods when OOP is appropriate
class UserService {
  createUser(userData: UserData): User {
    // Logic
  }
}
```

**❌ Avoid Regular Functions**
```typescript
// Avoid
function handleSubmit(event: FormEvent) {
  // Logic
}

function calculateTotal(items: Item[]): number {
  // Logic
}
```

### **Type Safety Standards**
**✅ Strict Type Safety - No `any` Type**
```typescript
// Good - Use specific types
const handleResponse = (response: ApiResponse<Data>) => {
  if (response.success) {
    return response.data
  }
  throw new Error(response.error.message)
}

// Good - Use unknown with type guards
const parseData = (data: unknown): Data => {
  if (isData(data)) {
    return data
  }
  throw new Error('Invalid data format')
}

const isData = (value: unknown): value is Data => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  )
}
```

**❌ Avoid `any` Type**
```typescript
// Avoid
const handleResponse = (response: any) => {
  return response.data // No type safety
}

// Avoid
const data: any = JSON.parse(jsonString)
```

**✅ Type Inference Over Type Assertions**
```typescript
// Good - Let TypeScript infer
const user = { id: 1, name: 'John' }
const userName = user.name // Type: string

// Good - Use generic functions
const getData = <T>(response: ApiResponse<T>): T => {
  return response.data
}

// Good - Use type guards
const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}
```

**❌ Avoid Type Assertions**
```typescript
// Avoid
const user = { id: 1, name: 'John' } as User
const userName = user.name as string

// Avoid - Force casting
const data = unknownValue as Data
```

### **React Component Patterns**
**✅ Functional Components with Hooks**
```typescript
// Good
const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null)
  const { data, loading } = useUserQuery(userId)

  useEffect(() => {
    if (data) {
      setUser(data)
    }
  }, [data])

  if (loading) return <Spinner />
  if (!user) return <div>User not found</div>

  return (
    <div className="user-profile">
      <Avatar src={user.avatar} />
      <h2>{user.name}</h2>
    </div>
  )
}
```

**✅ Custom Hooks Standard**
```typescript
// Good - Custom hook for complex logic
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Usage
const searchQuery = useDebounce(rawSearchQuery, 300)
```

### **State Management Patterns**
**✅ Zustand Store Pattern**
```typescript
// Good - Simple, focused store
interface UserState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}))
```

### **Error Handling Patterns**
**✅ Structured Error Handling**
```typescript
// Good - Specific error types
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const handleApiCall = async () => {
  try {
    const result = await apiCall()
    return result
  } catch (error) {
    if (error instanceof ApiError) {
      showToast(error.message, 'error')
    } else {
      showToast('Unknown error occurred', 'error')
    }
    throw error
  }
}
```

### **Async/Await Patterns**
**✅ Consistent Async Patterns**
```typescript
// Good - Always handle async properly
const fetchData = async (): Promise<Data[]> => {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch data:', error)
    throw error
  }
}

// Usage in React
const Component = () => {
  const [data, setData] = useState<Data[]>([])
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchData()
      setData(result)
    } catch (error) {
      showToast('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])
}
```

### **TypeScript Utility Patterns**
**✅ Utility Types and Generics**
```typescript
// Good - Reusable utility types
type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
  }
}

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Good - Generic utility functions
const createReducer = <T, A>(
  initialState: T,
  handlers: Record<string, (state: T, action: A) => T>
) => {
  return (state: T = initialState, action: A): T => {
    const handler = handlers[action.type]
    return handler ? handler(state, action) : state
  }
}
```

## 🎯 Core Refactoring Principles (YANGI & KISS)

### **YANGI (You Aren't Gonna Need It) Principle**
- **Question**: "Do we really need this feature?"
- **Application**: Focus on current requirements only, don't predict future needs
- **Goal**: Eliminate unnecessary code, features, and abstractions to minimize complexity

### **KISS (Keep It Simple, Stupid) Principle**
- **Question**: "Can we make this simpler?"
- **Application**: Choose simple solutions over complex multi-step logic
- **Goal**: Write code that's easy to understand and maintain

### **DRY (Don't Repeat Yourself)**
- **Check**: "Does this code already exist elsewhere?"
- **Integrate**: Merge similar functionality into single functions/classes
- **Example**: Merged `createReconnectionStrategy` and `createRetryStrategy` into single `createRetryStrategy`

### **Single Responsibility Principle**
- **Check**: "Does this function/class do only one thing?"
- **Separate**: Break code with multiple responsibilities into smaller units
- **Example**: Simplified error handler from 6 methods to 3 core methods

### **Complexity Management**
- **Function Complexity**: Maintain Cognitive Complexity below 15
- **Function Length**: Keep functions screen-length (recommended under 50 lines)
- **Nesting Depth**: Limit if/for nesting to 3 levels or less

### **Abstraction Minimization**
- **Unnecessary Layers**: Prefer direct calls over indirect calls
- **Over-Generalization**: Avoid generalizing beyond current needs
- **Simple Structure**: Choose simple structures over complex patterns

### **Backward Compatibility**
- **Incremental Improvement**: Refactor without breaking existing APIs
- **Convenience Methods**: Provide wrapper methods for existing code compatibility
- **Testing**: Always test existing functionality after refactoring

## 🚀 Refactoring Process

### 1. **Analysis Phase**
- Evaluate current code complexity
- Identify duplicate functionality
- Assess YANGI/KISS principle applicability

### 2. **Planning Phase**
- Set improvement priorities by phase
- Assess risks and create rollback plans
- Identify affected code areas

### 3. **Execution Phase**
- Make incremental changes in small units
- Verify compilation and linting at each step
- Maintain existing functionality compatibility

### 4. **Validation Phase**
- Confirm TypeScript compilation passes
- Verify Biome lint validation passes
- Test existing functionality behavior

## 📊 Refactoring Success Metrics

### **Code Reduction**
- **Target**: 20-30% code reduction
- **Measurement**: Line count, function count, file count

### **Complexity Reduction**
- **Target**: Cognitive Complexity below 15
- **Measurement**: Function complexity, nesting depth

### **Maintainability Improvement**
- **Target**: 50% improvement in code comprehension
- **Measurement**: Average function length, responsibility clarity

## ⚠️ Refactoring Anti-Patterns

### **Patterns to Avoid**
- **Over-Engineering**: Complex designs beyond current needs
- **Premature Optimization**: Unnecessary optimization of non-performance critical code
- **Abstraction Addiction**: Trying to generalize everything
- **Perfectionism**: Attempting to write perfect code from the start

### **Preferred Patterns**
- **Incremental Improvement**: Continuous small-unit improvements
- **Pragmatism**: Focus on solving real problems
- **Simplicity**: Choose simple solutions over complex ones
- **Flexibility**: Code that can easily adapt to change

## Important Notes

- The project follows Toss frontend guidelines for clean, maintainable code
- Use TypeScript with strict settings (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- Prefer kebab-case for file naming as enforced by Biome
- Components should follow single responsibility principle
- Avoid premature abstraction - allow some duplication if use cases might diverge

When working with this codebase, follow the established FSD patterns, use the existing UI components from shared/ui, and maintain the strict code quality standards enforced by Biome and the Git hooks.

## Additional Resources

- Always respond in Korean.
- Always use sequential thinking MCP.
