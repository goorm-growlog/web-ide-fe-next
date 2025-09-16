'use client'

import {
  CrownIcon,
  EditIcon,
  EyeIcon,
  MoreHorizontalIcon,
  TrashIcon,
  UserIcon,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'
import { Badge } from '@/shared/ui/shadcn/badge'
import { Button } from '@/shared/ui/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'
import { Skeleton } from '@/shared/ui/shadcn/skeleton'
import type { Member, ProjectRole } from '../types/invite-types'

interface MemberListProps {
  members: Member[]
  isLoading?: boolean
  onRoleChange?: (memberId: number, newRole: ProjectRole) => void
  onRemove?: (memberId: number) => void
  canManage?: boolean
  currentUserId?: number | undefined
}

const ROLE_CONFIG = {
  OWNER: {
    label: 'Owner',
    variant: 'default' as const,
    icon: CrownIcon,
    color: 'text-gray-100',
  },
  WRITE: {
    label: 'Editor',
    variant: 'secondary' as const,
    icon: EditIcon,
    color: 'text-gray-600',
  },
  READ: {
    label: 'Viewer',
    variant: 'outline' as const,
    icon: EyeIcon,
    color: 'text-gray-600',
  },
} as const

function MemberItem({
  member,
  onRoleChange,
  onRemove,
  canManage = false,
  currentUserId,
}: {
  member: Member
  onRoleChange?: ((memberId: number, newRole: ProjectRole) => void) | undefined
  onRemove?: ((memberId: number) => void) | undefined
  canManage: boolean
  currentUserId?: number | undefined
}) {
  const roleConfig = ROLE_CONFIG[member.role]
  const RoleIcon = roleConfig.icon
  const isOwner = member.role === 'OWNER'
  const isCurrentUser = member.userId === currentUserId
  const canRemove = canManage && !isOwner && !isCurrentUser
  const canChangeRole = canManage && !isOwner && !isCurrentUser

  const handleRoleChange = (newRole: ProjectRole) => {
    if (onRoleChange && canChangeRole) {
      onRoleChange(member.userId, newRole)
    }
  }

  const handleRemove = () => {
    if (onRemove && canRemove) {
      onRemove(member.userId)
    }
  }

  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={member.profileImageUrl} alt={member.name} />
          <AvatarFallback>
            <UserIcon className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium text-sm">
              {member.name}
              {isCurrentUser && (
                <span className="ml-1 text-muted-foreground text-xs">(나)</span>
              )}
            </p>
            <Badge variant={roleConfig.variant} className="text-xs">
              <RoleIcon className={`mr-1 h-3 w-3 ${roleConfig.color}`} />
              {roleConfig.label}
            </Badge>
          </div>

          <p className="truncate text-muted-foreground text-xs">
            {member.email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {canManage && (canChangeRole || canRemove) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canChangeRole && (
                <>
                  <DropdownMenuItem onClick={() => handleRoleChange('WRITE')}>
                    <EditIcon className="mr-2 h-4 w-4" />
                    Change to Editor
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleChange('READ')}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Change to Viewer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {canRemove && (
                <DropdownMenuItem
                  onClick={handleRemove}
                  className="text-destructive"
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Remove
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}

function MemberListSkeleton() {
  const skeletonItems = [1, 2, 3]

  return (
    <div className="space-y-3">
      {skeletonItems.map(id => (
        <div
          key={`member-skeleton-${id}`}
          className="flex items-center gap-3 rounded-lg border p-3"
        >
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      ))}
    </div>
  )
}

export function MemberList({
  members,
  isLoading = false,
  onRoleChange,
  onRemove,
  canManage = false,
  currentUserId,
}: MemberListProps) {
  if (isLoading) {
    return <MemberListSkeleton />
  }

  if (members.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <UserIcon className="mx-auto mb-4 h-12 w-12 opacity-50" />
        <p className="text-sm">No members found</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {members.map(member => (
        <MemberItem
          key={member.userId}
          member={member}
          onRoleChange={onRoleChange}
          onRemove={onRemove}
          canManage={canManage}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  )
}
