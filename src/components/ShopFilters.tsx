import { X } from 'lucide-react'
import type { Category, Material, PrinterCompatibility, ShopFilters as Filters } from '../lib/types'
import FilterCheckboxGroup from './FilterCheckboxGroup'
import PriceRangeSlider from './PriceRangeSlider'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Button } from './ui/button'

const CATEGORY_OPTIONS = [
  { value: 'home-decor', label: 'Home Decor' },
  { value: 'toys', label: 'Toys & Collectibles' },
  { value: 'tools', label: 'Tools & Storage' },
  { value: 'art', label: 'Art & Sculpture' },
  { value: 'functional-parts', label: 'Functional Parts' },
]

const PRINTER_OPTIONS = [
  { value: 'X1C', label: 'X1 Carbon' },
  { value: 'X1E', label: 'X1 Extreme' },
  { value: 'P1S', label: 'P1S' },
  { value: 'P1P', label: 'P1P' },
  { value: 'A1', label: 'A1' },
  { value: 'A1 Mini', label: 'A1 Mini' },
]

const MATERIAL_OPTIONS = [
  { value: 'PLA', label: 'PLA' },
  { value: 'PETG', label: 'PETG' },
  { value: 'ABS', label: 'ABS' },
  { value: 'ASA', label: 'ASA' },
  { value: 'TPU', label: 'TPU' },
  { value: 'PA', label: 'Nylon (PA)' },
]

interface ShopFiltersProps {
  filters: Filters
  onFiltersChange: (f: Filters) => void
}

function toggleItem<T extends string>(arr: T[], val: T, checked: boolean): T[] {
  return checked ? [...arr, val] : arr.filter((v) => v !== val)
}

export default function ShopFilters({ filters, onFiltersChange }: ShopFiltersProps) {
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.printers.length > 0 ||
    filters.materials.length > 0 ||
    filters.priceMin > 0 ||
    filters.priceMax < 5000

  function clearAll() {
    onFiltersChange({
      ...filters,
      categories: [],
      printers: [],
      materials: [],
      priceMin: 0,
      priceMax: 5000,
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between py-1">
        <span className="text-sm font-semibold text-[var(--sea-ink)]">Filters</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-[var(--sea-ink-soft)]"
            onClick={clearAll}
          >
            <X className="h-3 w-3" /> Clear all
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={['category', 'price']}>
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm">Category</AccordionTrigger>
          <AccordionContent>
            <FilterCheckboxGroup
              title="Category"
              options={CATEGORY_OPTIONS}
              selected={filters.categories}
              onChange={(val, checked) =>
                onFiltersChange({
                  ...filters,
                  categories: toggleItem(filters.categories, val as Category, checked),
                })
              }
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-sm">Price Range</AccordionTrigger>
          <AccordionContent>
            <PriceRangeSlider
              min={0}
              max={5000}
              value={[filters.priceMin, filters.priceMax]}
              onChange={([min, max]) =>
                onFiltersChange({ ...filters, priceMin: min, priceMax: max })
              }
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="printer">
          <AccordionTrigger className="text-sm">Printer Model</AccordionTrigger>
          <AccordionContent>
            <FilterCheckboxGroup
              title="Printer"
              options={PRINTER_OPTIONS}
              selected={filters.printers}
              onChange={(val, checked) =>
                onFiltersChange({
                  ...filters,
                  printers: toggleItem(filters.printers, val as PrinterCompatibility, checked),
                })
              }
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="material">
          <AccordionTrigger className="text-sm">Material</AccordionTrigger>
          <AccordionContent>
            <FilterCheckboxGroup
              title="Material"
              options={MATERIAL_OPTIONS}
              selected={filters.materials}
              onChange={(val, checked) =>
                onFiltersChange({
                  ...filters,
                  materials: toggleItem(filters.materials, val as Material, checked),
                })
              }
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
