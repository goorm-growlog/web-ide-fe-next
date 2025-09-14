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
    if (newValues.length > 0) {
      onChange(newValues[0])
    }
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Volume2 className="h-3 w-3 text-muted-foreground" />
      <Slider
        value={[value]}
        onValueChange={handleValueChange}
        max={100}
        min={0}
        step={1}
        className="w-16"
      />
      <span className="w-6 text-muted-foreground text-xs">{value}</span>
    </div>
  )
}
