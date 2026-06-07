import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'

interface FilterCheckboxGroupProps {
  title: string
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (value: string, checked: boolean) => void
}

export default function FilterCheckboxGroup({
  options,
  selected,
  onChange,
}: FilterCheckboxGroupProps) {
  return (
    <div className="space-y-2.5">
      {options.map(({ value, label }) => (
        <div key={value} className="flex items-center gap-2">
          <Checkbox
            id={value}
            checked={selected.includes(value)}
            onCheckedChange={(checked) => onChange(value, !!checked)}
          />
          <Label htmlFor={value} className="cursor-pointer text-sm text-[var(--sea-ink)] font-normal">
            {label}
          </Label>
        </div>
      ))}
    </div>
  )
}
