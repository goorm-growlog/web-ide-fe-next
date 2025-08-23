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

## Important Notes

- The project follows Toss frontend guidelines for clean, maintainable code
- Use TypeScript with strict settings (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- Prefer kebab-case for file naming as enforced by Biome
- Components should follow single responsibility principle
- Avoid premature abstraction - allow some duplication if use cases might diverge

When working with this codebase, follow the established FSD patterns, use the existing UI components from shared/ui, and maintain the strict code quality standards enforced by Biome and the Git hooks.

## Additional Resources
