# TanStack Component Scaffolding Skills — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create two Claude Code skill files that interactively scaffold consistent React components for TanStack Start + Query + React Hook Form + Zod + Shadcn UI projects.

**Architecture:** Two focused Markdown skill files live in `.claude/skills/`. Each is generic (no project-specific hardcoding), interactive (asks questions before generating), and enforces a strict set of conventions. `/new-form-component` handles forms; `/new-query-component` handles data-display.

**Tech Stack:** Claude Code skill Markdown format, React Hook Form v7, Zod v3+, TanStack Query v5, Shadcn UI (Radix + Tailwind)

---

## Task 1: Create `new-form-component` skill

**Files:**
- Create: `.claude/skills/new-form-component.md`

- [ ] **Step 1: Create the skill file**

Create `.claude/skills/new-form-component.md` with the following complete content:

```markdown
---
name: new-form-component
description: Interactively scaffold a React form component — React Hook Form + Zod schema + Shadcn UI fields. Asks questions before generating any code.
---

# New Form Component

You are scaffolding a typed, validated React form component. Do NOT generate any code until you have answered all questions. Ask them one at a time — wait for the user's answer before asking the next.

---

## Phase 1: Requirements gathering

**Question 1 — Name and purpose**
Ask: "What is the component called and what does it do? (e.g. `CreateProductForm` — adds a new product to the catalog)"

**Question 2 — Fields**
Ask: "List all form fields. For each, tell me:
- Field name (camelCase)
- Type: `text | email | number | select | checkbox | switch | textarea`
- Required or optional
- For `select`: what are the options?
- For `number`: any min/max constraints?"

**Question 3 — Submit behavior**
Ask: "What happens on successful submit? Choose one:
1. Navigate to a route (tell me the path)
2. Show an inline success state
3. Call a callback prop `onSuccess(data)`"

**Question 4 — Location**
Ask: "Where does this component live?
1. Route file: `src/routes/<path>.tsx`
2. Standalone component: `src/components/<Name>.tsx`"

---

## Phase 2: Code generation

Once all four questions are answered, generate three clearly separated blocks.

---

### Block 1 — Zod Schema

Label this block: `// ── PASTE INTO your schemas file (e.g. src/lib/schemas.ts) ──`

```ts
import { z } from 'zod'

export const <componentName>Schema = z.object({
  // one entry per field
})

export type <ComponentName>FormValues = z.infer<typeof <componentName>Schema>
```

**Schema field rules (apply strictly):**
- `text`: `z.string().trim().min(1, 'Required')`
- `email`: `z.string().trim().min(1, 'Required').email('Invalid email')`
- `number`: `z.coerce.number()` — add `.min(n)` / `.max(n)` if constraints given
- `select` with known options: `z.enum(['option1', 'option2', ...])`
- `checkbox` / `switch`: `z.boolean()`
- `textarea`: `z.string().trim().min(1, 'Required')` (or `.min(10, ...)` if long text)
- Optional fields: append `.optional()`
- Never use `z.any()`

---

### Block 2 — Component

Label this block: `// ── COMPONENT (<location from question 4>) ──`

**Imports to include (adjust paths to match the project):**
```tsx
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// Add only the Shadcn components actually used by the fields
```

**`useForm` setup — always this exact shape:**
```tsx
const {
  register,
  control,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<<ComponentName>FormValues>({
  mode: 'onTouched',
  resolver: zodResolver(<componentName>Schema),
})
```

**Field wiring rules (apply strictly):**

`text | email | number | textarea` — use `register`:
```tsx
<Input
  id="fieldName"
  type="text" // or email, number
  aria-invalid={!!errors.fieldName}
  {...register('fieldName')}
/>
```

`select` — use `Controller` wrapping Shadcn `Select`:
```tsx
<Controller
  control={control}
  name="fieldName"
  render={({ field }) => (
    <Select value={field.value} onValueChange={field.onChange}>
      <SelectTrigger aria-invalid={!!errors.fieldName}>
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectContent>
    </Select>
  )}
/>
```

`checkbox` — use `Controller` wrapping Shadcn `Checkbox`:
```tsx
<Controller
  control={control}
  name="fieldName"
  render={({ field }) => (
    <Checkbox
      checked={field.value}
      onCheckedChange={field.onChange}
    />
  )}
/>
```

`switch` — use `Controller` wrapping Shadcn `Switch`:
```tsx
<Controller
  control={control}
  name="fieldName"
  render={({ field }) => (
    <Switch
      checked={field.value}
      onCheckedChange={field.onChange}
    />
  )}
/>
```

**Always include a `FieldError` helper** (inline, at the top of the file before the main component):
```tsx
function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-destructive">{message}</p>
}
```

Place `<FieldError message={errors.fieldName?.message} />` directly after every field's control element.

**Use a `Section` wrapper when the form has more than 3 fields:**
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5 space-y-4">{children}</CardContent>
    </Card>
  )
}
```

**Submit button — always this shape:**
```tsx
<Button type="submit" disabled={isSubmitting} className="w-full">
  {isSubmitting ? 'Submitting...' : 'Submit' /* TODO: extract to strings file */}
</Button>
```

**Submit handler shape:**
- Navigate: `const navigate = useNavigate(); function onSubmit(data) { navigate({ to: '/path' }) }`
- Success state: `const [submitted, setSubmitted] = useState(false); function onSubmit(data) { setSubmitted(true) }`
- Callback: `function onSubmit(data) { onSuccess(data) }`

**String literals** — leave all display text as inline strings with `// TODO: extract to your strings file` comment on the same line.

---

### Block 3 — Placement instructions

After the two code blocks, give a short numbered list:
1. Where to paste the schema (file path, and note to import it in the component)
2. Where to create/place the component file
3. Any Shadcn components used that may need installing (`pnpm dlx shadcn@latest add <name>`)
4. Confirm `@hookform/resolvers` is installed (`npm i @hookform/resolvers`)
```

- [ ] **Step 2: Verify file was created correctly**

Open `.claude/skills/new-form-component.md` and confirm:
- YAML frontmatter is present with `name` and `description`
- Phase 1 has exactly 4 questions
- Phase 2 has exactly 3 blocks with correct labels
- All four field wiring patterns are present (text/email/number/textarea, select, checkbox, switch)
- `FieldError` helper is included
- `Section` wrapper is included
- No placeholder text ("TBD", "TODO in skill", etc.)

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/new-form-component.md
git commit -m "feat: add new-form-component Claude Code skill"
```

---

## Task 2: Create `new-query-component` skill

**Files:**
- Create: `.claude/skills/new-query-component.md`

- [ ] **Step 1: Create the skill file**

Create `.claude/skills/new-query-component.md` with the following complete content:

```markdown
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
3. Confirm `QueryClientProvider` wraps the app (if not already set up, show the minimal setup)
4. Any Shadcn components used that may need installing (`pnpm dlx shadcn@latest add <name>`)
```

- [ ] **Step 2: Verify file was created correctly**

Open `.claude/skills/new-query-component.md` and confirm:
- YAML frontmatter is present with `name` and `description`
- Phase 1 has exactly 5 questions
- Phase 2 has exactly 4 blocks with correct labels
- All 4 skeleton variants are present (list, table, card-grid, detail)
- Error state component is included with retry button
- All 3 extra features (pagination, search, sort) are present
- No placeholder text ("TBD", "TODO in skill", etc.)

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/new-query-component.md
git commit -m "feat: add new-query-component Claude Code skill"
```

---

## Task 3: Smoke-test both skills

No automated tests exist for skill files — validation is manual invocation.

- [ ] **Step 1: Test `new-form-component`**

In a new Claude Code session in the target project, run:
```
/new-form-component
```

Verify Claude:
1. Asks question 1 (name/purpose) and waits
2. After answering, asks question 2 (fields) and waits
3. After answering, asks question 3 (submit behavior) and waits
4. After answering, asks question 4 (location) and waits
5. Generates Block 1 (schema), Block 2 (component), Block 3 (placement)
6. Schema uses `zodResolver`, correct field types, no `any`
7. Component uses `mode: 'onTouched'`, `aria-invalid`, `FieldError` helper
8. Non-text fields (`select`/`checkbox`/`switch`) use `Controller`
9. Text fields use `register`

Sample answers to use for the test:
- Name: `ContactForm — collects name, email, and message`
- Fields: `name: text required`, `email: email required`, `message: textarea required`, `newsletter: checkbox optional`
- Submit: callback prop `onSuccess`
- Location: `src/components/ContactForm.tsx`

Expected generated schema:
```ts
export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Required'),
  email: z.string().trim().min(1, 'Required').email('Invalid email'),
  message: z.string().trim().min(1, 'Required'),
  newsletter: z.boolean().optional(),
})
```

`message` must use `register`, `newsletter` must use `Controller` wrapping `Checkbox`.

- [ ] **Step 2: Test `new-query-component`**

In a new Claude Code session in the target project, run:
```
/new-query-component
```

Verify Claude:
1. Asks all 5 questions one at a time
2. Generates Block 1 (types + key), Block 2 (queryFn), Block 3 (component), Block 4 (placement)
3. `queryFn` is `async`, checks `res.ok`, has explicit return type
4. Component checks `isLoading` and `isError` before rendering data
5. Loading state uses `Skeleton`, not plain text
6. Error state has retry button calling `refetch`

Sample answers to use for the test:
- Name: `UserList — displays all users`
- Endpoint: `GET /api/users`
- Shape: `table`
- Fields: `id: string`, `name: string`, `email: string`, `role: string`
- Features: no pagination, yes search, no sort

Expected: component renders a `Table`, has a search `Input` with client-side filter, loading state shows 5 `Skeleton` rows.

- [ ] **Step 3: Commit test notes (optional)**

If you wrote notes on edge cases or observed deviations from spec during testing, capture them in `docs/superpowers/specs/2026-06-16-tanstack-component-skills-design.md` as a "Testing notes" section and commit.

```bash
git add docs/superpowers/specs/2026-06-16-tanstack-component-skills-design.md
git commit -m "docs: add smoke test notes for component skills"
```
