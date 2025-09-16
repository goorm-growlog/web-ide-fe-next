import { Volume2 } from 'lucide-react'
import { Slider } from '@/shared/ui/slider'

interface VolumeSliderProps {
  value: number
  onChange: (value: number) => void
  className?: string
}

export function VolumeSlider({
  value,
  onChange,
  className,
}: VolumeSliderProps) {
  const handleValueChange = (newValues: number[]) => {
    if (newValues.length > 0 && newValues[0] !== undefined) {
      onChange(newValues[0])
    }
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Volume2 className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
      <Slider
        value={[value]}
        onValueChange={handleValueChange}
        max={100}
        min={0}
        step={1}
        className="flex-1"
      />
      <span className="w-4 flex-shrink-0 pr-4 text-center font-medium text-foreground text-sm">
        {value}
      </span>
    </div>
  )
}
