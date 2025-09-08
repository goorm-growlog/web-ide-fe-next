'use client'

import { ChevronDown, LogOut, UserRoundPen } from 'lucide-react'
import Image from 'next/image'
import { useUser } from '@/entities/users'
import { useLogout } from '@/features/auth/logout/model/use-logout'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'

export function MainHeader() {
  const { logout } = useLogout()
  const { user } = useUser()

  // 사용자 이름의 첫 글자 추출 (fallback용)
  const getInitial = (name?: string) => {
    if (!name) return 'U'
    return name.charAt(0).toUpperCase()
  }

  return (
    <header className="fixed top-0 z-50 flex h-[71px] w-full items-center justify-between bg-white px-10">
      {/* Logo */}
      <div className="flex items-center">
        <Image src="/logo.svg" alt="GrowLog" width={103} height={26} />
      </div>

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.profileImage || ''}
              alt={user?.name || 'Profile'}
            />
            <AvatarFallback className="text-sm">
              {getInitial(user?.name || user?.email)}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <UserRoundPen className="h-4 w-4" />
            edit profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
