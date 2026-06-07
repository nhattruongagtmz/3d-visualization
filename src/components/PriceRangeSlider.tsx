import { formatPrice } from '../lib/utils'
import { Slider } from './ui/slider'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export default function PriceRangeSlider({ min, max, value, onChange }: PriceRangeSliderProps) {
  return (
    <div className="space-y-3">
      <Slider
        min={min}
        max={max}
        step={100}
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-[var(--sea-ink-soft)]">
        <span>{formatPrice(value[0])}</span>
        <span>{formatPrice(value[1])}</span>
      </div>
    </div>
  )
}
