import { Search } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { Input } from '@/shared/ui/shadcn/input'

interface ProjectSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string | undefined
}

export const ProjectSearch = ({
  value,
  onChange,
  placeholder,
}: ProjectSearchProps) => (
  <div className="relative mb-3">
    <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
    <Input
      placeholder={placeholder || 'Search projects...'}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      className="h-10 pl-10"
    />
  </div>
)
