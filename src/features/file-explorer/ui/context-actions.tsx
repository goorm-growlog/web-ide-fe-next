import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/shared/ui/shadcn/context-menu'

// Compound Components Pattern
interface ContextActionsRootProps {
  readonly children: React.ReactNode
}

interface ContextActionsTriggerProps {
  readonly children: React.ReactNode
  readonly onContextMenu?: () => void
}

interface ContextActionsContentProps {
  readonly children: React.ReactNode
}

interface CreateActionProps {
  readonly type: 'file' | 'folder'
  readonly onTrigger: () => void
  readonly shortcut?: string
  readonly label: string
}

interface DestructiveActionProps {
  readonly onTrigger: () => void
  readonly shortcut?: string
  readonly label: string
  readonly disabled?: boolean
}

interface StandardActionProps {
  readonly onTrigger: () => void
  readonly shortcut?: string
  readonly label: string
}

const ContextActionsRoot = ({ children }: ContextActionsRootProps) => (
  <ContextMenu>{children}</ContextMenu>
)

const ContextActionsTrigger = ({
  children,
  onContextMenu,
}: ContextActionsTriggerProps) => (
  <ContextMenuTrigger onContextMenu={onContextMenu}>
    {children}
  </ContextMenuTrigger>
)

const ContextActionsContent = ({ children }: ContextActionsContentProps) => (
  <ContextMenuContent>{children}</ContextMenuContent>
)

const CreateAction = ({ onTrigger, shortcut, label }: CreateActionProps) => (
  <ContextMenuItem onClick={onTrigger}>
    {label}
    {shortcut && <ContextMenuShortcut>{shortcut}</ContextMenuShortcut>}
  </ContextMenuItem>
)

const StandardAction = ({
  onTrigger,
  shortcut,
  label,
}: StandardActionProps) => (
  <ContextMenuItem onClick={onTrigger}>
    {label}
    {shortcut && <ContextMenuShortcut>{shortcut}</ContextMenuShortcut>}
  </ContextMenuItem>
)

const DestructiveAction = ({
  onTrigger,
  shortcut,
  label,
  disabled = false,
}: DestructiveActionProps) => (
  <ContextMenuItem
    variant="destructive"
    onClick={onTrigger}
    disabled={disabled}
  >
    {label}
    {shortcut && <ContextMenuShortcut>{shortcut}</ContextMenuShortcut>}
  </ContextMenuItem>
)

const Separator = () => <ContextMenuSeparator />

// Compound Component Export
export const ContextActions = {
  Root: ContextActionsRoot,
  Trigger: ContextActionsTrigger,
  Content: ContextActionsContent,
  Create: CreateAction,
  Standard: StandardAction,
  Destructive: DestructiveAction,
  Separator,
}
