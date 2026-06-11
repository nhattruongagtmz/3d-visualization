import { X } from 'lucide-react'
import type { Category, Material, PrinterCompatibility, ShopFilters as Filters } from '../lib/types'
import { strings } from '../lib/strings'
import FilterCheckboxGroup from './FilterCheckboxGroup'
import PriceRangeSlider from './PriceRangeSlider'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Button } from './ui/button'

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
        <span className="text-sm font-semibold text-[var(--sea-ink)]">{strings.filters.title}</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-[var(--sea-ink-soft)]"
            onClick={clearAll}
          >
            <X className="h-3 w-3" /> {strings.filters.clearAll}
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={['category', 'price']}>
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm">{strings.filters.categoryAccordion}</AccordionTrigger>
          <AccordionContent>
            <FilterCheckboxGroup
              title={strings.filters.categoryAccordion}
              options={strings.filters.categories}
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
          <AccordionTrigger className="text-sm">{strings.filters.priceRangeAccordion}</AccordionTrigger>
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
          <AccordionTrigger className="text-sm">{strings.filters.printerAccordion}</AccordionTrigger>
          <AccordionContent>
            <FilterCheckboxGroup
              title={strings.filters.printerAccordion}
              options={strings.filters.printers}
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
          <AccordionTrigger className="text-sm">{strings.filters.materialAccordion}</AccordionTrigger>
          <AccordionContent>
            <FilterCheckboxGroup
              title={strings.filters.materialAccordion}
              options={strings.filters.materials}
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
