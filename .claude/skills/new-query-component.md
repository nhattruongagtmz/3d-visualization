---
name: new-query-component
description: Interactively scaffold a React data-display component — TanStack Query + typed fetch + Shadcn UI. Asks questions before generating any code.
---

# New Query Component

You are scaffolding a typed data-display React component backed by TanStack Query. Do NOT generate any code until you have answered all questions. Ask them one at a time — wait for the user's answer before asking the next.

---

## Phase 1: Requirements gathering

**Question 1 — Name and purpose**
Ask: "What is the component called and what does it do? (e.g. `ProductList` — displays all products from the API)"

**Question 2 — API endpoint**
Ask: "What is the API endpoint URL and HTTP method? (e.g. `GET /api/products` or `GET /api/users/:id`)
If the URL has dynamic segments like `:id`, also tell me: what prop or state value provides that segment?"

**Question 3 — Display shape**
Ask: "How should the data be displayed?
1. `list` — vertical list of items
2. `table` — rows with column headers (optionally sortable)
3. `card-grid` — responsive grid of cards
4. `detail` — single-item detail view"

**Question 4 — Data fields**
Ask: "What fields does each data item have? Give me the field name and TypeScript type for each. (e.g. `id: string`, `name: string`, `price: number`, `inStock: boolean`)"

**Question 5 — Extra features**
Ask: "Which of these features do you need? Answer yes or no for each:
- Pagination
- Text search / filter
- Sort by column"

---

## Phase 2: Code generation

Once all five questions are answered, generate four clearly separated blocks.

---

### Block 1 — Types and query key constant

Label this block: `// ── TYPES + QUERY KEY (top of component file or shared types file) ──`

```ts
interface <Item>DTO {
  // one property per field from question 4
  // never use `any`
}

const <item>Keys = {
  all: ['<items>'] as const,
  detail: (id: string) => ['<items>', id] as const,
} as const
```

**Rules:**
- Interface name is `<Item>DTO` where `<Item>` is the singular entity name (e.g. `ProductDTO`)
- Query key constant name is `<item>Keys` (camelCase, e.g. `productKeys`)
- Key strings are lowercase plural entity name (e.g. `'products'`)
- If endpoint has path params, include the `detail` key; if list-only, omit it
- Never use inline string arrays in `useQuery` — always reference this constant
- Never use `any`

---

### Block 2 — Query function

Label this block: `// ── QUERY FUNCTION ──`

**List endpoint (no path params):**
```ts
async function fetch<Items>(): Promise<<Item>DTO[]> {
  const res = await fetch('/api/<items>')
  if (!res.ok) throw new Error(res.statusText)
  return res.json() as Promise<<Item>DTO[]>
}
```

**Detail endpoint (with path param):**
```ts
async function fetch<Item>(id: string): Promise<<Item>DTO> {
  const res = await fetch(`/api/<items>/${id}`)
  if (!res.ok) throw new Error(res.statusText)
  return res.json() as Promise<<Item>DTO>
}
```

**Rules:**
- Always `async`
- Always check `if (!res.ok) throw new Error(res.statusText)`
- Return type is always explicit — never `any` or implicit
- Accept path params as function arguments, not closures
- If pagination/search needed, accept as additional arguments: `(page: number, search: string)`

---

### Block 3 — Component

Label this block: `// ── COMPONENT ──`

**Imports:**
```tsx
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
// Add only the Shadcn display components actually needed
```

**Component structure — always this shape:**
```tsx
function <ComponentName>() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: <item>Keys.all,
    queryFn: fetch<Items>,
  })

  if (isLoading) return <<ComponentName>Skeleton />
  if (isError) return <<ComponentName>Error onRetry={refetch} />

  return (
    // display markup goes here — data is guaranteed non-undefined at this point
  )
}
```

**Loading skeleton — sized to match display shape:**

`list` (3 items):
```tsx
function <ComponentName>Skeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  )
}
```

`table` (5 rows):
```tsx
function <ComponentName>Skeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-full rounded" /> {/* header */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded" />
      ))}
    </div>
  )
}
```

`card-grid` (6 cards):
```tsx
function <ComponentName>Skeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-xl" />
      ))}
    </div>
  )
}
```

`detail` (single):
```tsx
function <ComponentName>Skeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/2 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-3/4 rounded" />
    </div>
  )
}
```

**Error state — always this shape:**
```tsx
function <ComponentName>Error({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <p className="text-sm text-destructive">
        Failed to load data. {/* TODO: extract to your strings file */}
      </p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again {/* TODO: extract to your strings file */}
      </Button>
    </div>
  )
}
```

**Display markup rules by shape:**

`list` — use `<ul>` with a `<li>` per item showing the key fields
`table` — use Shadcn `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`
`card-grid` — use `grid grid-cols-2 sm:grid-cols-3 gap-4` with Shadcn `Card` per item
`detail` — use Shadcn `Card` with labeled field rows

**Extra features — apply only if requested in question 5:**

Pagination:
```tsx
const [page, setPage] = useState(1)
const { data, isLoading, isError, refetch } = useQuery({
  queryKey: [...<item>Keys.all, page],
  queryFn: () => fetch<Items>(page),
})
// Add prev/next buttons below the display
```

Text search (client-side filter):
```tsx
const [search, setSearch] = useState('')
// After data is loaded:
const filtered = data.filter(item =>
  item.name.toLowerCase().includes(search.toLowerCase())
)
// Render `filtered` instead of `data`
// Add <Input> with value={search} onChange={e => setSearch(e.target.value)} above display
```

Sort (client-side):
```tsx
const [sortKey, setSortKey] = useState<keyof <Item>DTO>('<defaultField>')
const [sortDir, setSortDir] = useState<1 | -1>(-1)
const sorted = [...(data ?? [])].sort((a, b) => {
  const av = a[sortKey], bv = b[sortKey]
  if (typeof av === 'string') return av.localeCompare(bv as string) * sortDir
  return ((av as number) - (bv as number)) * sortDir
})
```

**String literals** — leave all display text as inline strings with `// TODO: extract to your strings file` comment on the same line.

---

### Block 4 — Placement instructions

After the three code blocks, give a short numbered list:
1. Where to place the component file
2. Confirm `@tanstack/react-query` is installed (`npm i @tanstack/react-query`)
3. Confirm `QueryClientProvider` wraps the app (if not already set up, show the minimal setup):
```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()
// Wrap your app: <QueryClientProvider client={queryClient}><App /></QueryClientProvider>
```
4. Any Shadcn components used that may need installing (`pnpm dlx shadcn@latest add <name>`)
