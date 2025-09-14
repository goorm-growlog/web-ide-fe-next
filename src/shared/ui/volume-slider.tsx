import type React from 'react'
import { cn } from '@/shared/lib/utils'

interface VolumeSliderProps {
  value: number
  onChange: (value: number) => void
  className?: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

export function VolumeSlider({
  value,
  onChange,
  className,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
}: VolumeSliderProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const newValue = parseInt(event.target.value, 10)
    onChange(newValue)
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          'h-2 w-full appearance-none rounded-lg bg-gray-200 dark:bg-gray-700',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
          '[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none',
          '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500',
          disabled
            ? '[&::-webkit-slider-thumb]:cursor-not-allowed'
            : '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:bg-blue-600',
          '[&::-webkit-slider-track]:bg-gray-200 [&::-webkit-slider-track]:dark:bg-gray-700',
          '[&::-webkit-slider-track]:rounded-lg',
          '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full',
          '[&::-moz-range-thumb]:bg-blue-500',
          disabled
            ? '[&::-moz-range-thumb]:cursor-not-allowed'
            : '[&::-moz-range-thumb]:cursor-pointer',
          '[&::-moz-range-thumb]:border-0',
          disabled ? '' : '[&::-moz-range-thumb]:hover:bg-blue-600',
          '[&::-moz-range-track]:bg-gray-200 [&::-moz-range-track]:dark:bg-gray-700',
          '[&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-lg',
        )}
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  )
}
