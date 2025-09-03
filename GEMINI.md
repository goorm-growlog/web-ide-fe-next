# Project Overview

This is a Next.js frontend application, likely serving as the client-side for a web-based Integrated Development Environment (IDE). It leverages modern web technologies to provide a rich and interactive user experience.

**Key Technologies:**
*   **Framework:** Next.js 15 (with App Router)
*   **UI Library:** React 19
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, CSS Modules (for component-specific styles)
*   **Component Primitives:** Radix UI
*   **State Management:** Zustand, React 19 hooks and context
*   **Form Validation:** Zod, React Hook Form
*   **Linting & Formatting:** Biome
*   **Component Development:** Storybook (with a11y addon)
*   **Tree Components:** `@headless-tree/react` (used for file explorer)
*   **Icons:** Lucide React icon library
*   **Testing:** Playwright (for end-to-end testing)

**Purpose & Features:**
The project appears to be building a comprehensive web IDE with the following inferred features:
*   **Project Management:** Indicated by `app/project` routes.
*   **Authentication:** Includes sign-in/sign-up, social login (GitHub, Kakao), email verification, and password reset functionalities. Middleware is used for authentication flow, though temporarily bypassed.
*   **File Explorer:** Features a file tree with drag & drop, rename, and drop handlers. Context menu support is provided via Radix UI.
*   **Chat:** Includes message parsing with GitHub-style file links (`fileName:lineNumber`), auto-scroll behavior with scroll restoration, and support for ENTER/TALK/LEAVE message types.
*   **User Settings:** Suggested by `src/features/setting`.

**Architecture:**
The project follows the **Feature-Sliced Design (FSD)** architecture. The `src/` directory is organized into distinct layers:
*   `src/app/`: Next.js App Router pages.
*   `src/entities/`: Core business entities (e.g., chats, files, projects, users).
*   `src/features/`: Feature-specific components and logic (e.g., chat, file-explorer, invite, members, search, voice-chats).
*   `src/shared/`: Reusable utilities and UI components (e.g., `lib/` for utilities like date, scroll, string; `ui/` for shadcn/ui and custom UI components).
*   `src/widgets/`: Complex UI compositions (e.g., sidebar with tab switching and panels).

# Building and Running

To get started with the project, follow these steps:

**1. Install Dependencies:**
This project uses `pnpm` as its package manager.
```bash
pnpm install
```

**2. Run the Development Server:**
```bash
pnpm dev # Uses Turbopack for faster builds
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application. The page auto-updates as you edit files.

**3. Build for Production:**
```bash
pnpm build
```

**4. Start Production Server:**
```bash
pnpm start
```

**5. Linting and Formatting:**
This project uses Biome for linting and formatting.
*   Check for linting errors and formatting issues:
    ```bash
pnpm lint
```
*   Fix linting errors and format code automatically:
    ```bash
pnpm lint:fix
pnpm format
```

**6. Type Checking:**
```bash
pnpm exec tsc --noEmit
```

**7. Storybook:**
To run Storybook for component development:
```bash
pnpm storybook
```
To build Storybook for deployment:
```bash
pnpm build-storybook
```

# Development Conventions

**Code Quality & Git Hooks:**
This project uses **Lefthook** for Git hooks with strict quality controls:
*   **Pre-commit:** Auto-fixes code with Biome linter/formatter, stages fixed files.
*   **Pre-push:** Runs lint checks and TypeScript type checking (both must pass).
*   **Commit-msg:** Enforces Conventional Commits format with commitlint.

**Biome Configuration:**
Biome is used instead of ESLint/Prettier with comprehensive rules including:
*   Korean comments explaining enhanced TypeScript settings.
*   A11y, performance, Next.js, and nursery rules enabled.
*   Strict naming conventions (`kebab-case` for files) and import organization.
*   80-character line width, single quotes, trailing commas.
*   `useSortedClasses` is enabled for Tailwind CSS classes.

**Commit Messages:**
*   **Convention:** Follows Conventional Commits specification, extended from `@commitlint/config-conventional`.
*   **Subject Case:** The `subject-case` rule is disabled, allowing any case for the commit subject.

**TypeScript Configuration:**
Enhanced TypeScript settings are used for stricter type checking:
*   `noUncheckedIndexedAccess: true` - Safer array/object access.
*   `exactOptionalPropertyTypes: true` - Stricter optional property handling.
*   Path mapping: `@/*` → `./src/*`.

**File Naming & Conventions:**
*   **Files:** `kebab-case` recommended by Biome config.
*   **Components:** `PascalCase` for React components.
*   **Functions/Variables:** `camelCase`, `PascalCase`, or `CONSTANT_CASE`.
*   **CSS Modules:** `.module.css` suffix for component-specific styles.
*   **Storybook:** `.stories.tsx` suffix for component stories.

**API Handling:**
*   A custom `fetchApi` utility (`src/shared/api/fetch-api.ts`) is provided for making unauthenticated API requests with consistent error handling.
*   API requests are proxied through Next.js rewrites defined in `next.config.ts`, routing `/auth/:path*` and `/api/:path*` to `NEXT_PUBLIC_API_BASE_URL`.

**UI Development:**
*   Leverages Radix UI for accessible, unstyled components.
*   Uses `shadcn/ui` for pre-styled, customizable components built on top of Radix UI.
*   The `cn` utility (`src/shared/lib/utils.ts`) is used for conditionally combining Tailwind CSS classes.

**Authentication Middleware:**
*   `src/middleware.ts` contains Next.js middleware for handling authentication and protecting routes.
*   **Note:** The authentication protection is currently temporarily disabled due to a backend cookie path issue. It will be re-enabled once the backend is updated.

**Development Rules & Patterns (Based on Cursor rules):**
*   **Readability:** Use named constants for magic numbers, abstract complex logic into dedicated components.
*   **Predictability:** Standardize return types for similar functions, avoid hidden side effects.
*   **Cohesion:** Organize code by feature/domain, keep related logic together.
*   **Coupling:** Prefer composition over prop drilling, scope state management appropriately.

**Important Notes:**
*   The project follows Toss frontend guidelines for clean, maintainable code.
*   Use TypeScript with strict settings (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).
*   Prefer `kebab-case` for file naming as enforced by Biome.
*   Components should follow single responsibility principle.
*   Avoid premature abstraction - allow some duplication if use cases might diverge.

When working with this codebase, follow the established FSD patterns, use the existing UI components from `shared/ui`, and maintain the strict code quality standards enforced by Biome and the Git hooks.
