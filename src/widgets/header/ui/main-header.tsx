'use client'

import { ChevronDown, LogOut, UserRoundPen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useLogout } from '@/features/core-auth/logout/model/use-logout'
import { useAuth } from '@/shared/contexts/auth-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'

export function MainHeader() {
  const { logout } = useLogout()
  const { user, isLoading } = useAuth()

  const getInitial = (name?: string) => {
    if (!name) return 'U'
    return name.charAt(0).toUpperCase()
  }

  return (
    <header className="fixed top-0 z-50 flex h-[70px] w-full items-center justify-between bg-white px-10">
      <div className="flex items-center">
        <Image src="/logo.svg" alt="GrowLog" width={103} height={26} />
      </div>

      {!isLoading && user && (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.profileImage || ''}
                alt={user.name || 'Profile'}
              />
              <AvatarFallback className="text-sm">
                {getInitial(user.name || user.email)}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <UserRoundPen className="h-4 w-4" />
                edit profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}
