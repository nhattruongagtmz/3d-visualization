# Design: TanStack Component Scaffolding Skills

**Date:** 2026-06-16
**Status:** Approved

## Overview

Two reusable Claude Code skill files that scaffold consistent React components for projects using TanStack Start, TanStack Query, React Hook Form, Zod, and Shadcn UI. Each skill is interactive — it asks targeted clarifying questions before generating any code.

## File Structure

```
.claude/
  skills/
    new-form-component.md
    new-query-component.md
```

Both files are project-scoped (`.claude/skills/` in the target repo) but generic enough to install globally at `~/.claude/skills/` for cross-project use.

**Invocation:**
- `/new-form-component` — scaffolds a form component
- `/new-query-component` — scaffolds a data-display component

---

## Skill 1: `new-form-component`

### Purpose
Scaffolds a form component using React Hook Form + Zod + Shadcn UI with consistent field wiring, validation, and submit handling.

### Interactive questions (one at a time)
1. Component name and purpose (e.g. "CreateProductForm — adds a new product")
2. Fields: for each field — name, type (`text | email | number | select | checkbox | switch | textarea`), required or optional
3. Submit behavior: what happens on success (navigate to a route, show a success state, call a callback prop `onSuccess`)
4. Location: route file (`src/routes/`) or standalone component (`src/components/`)

### Generated output
- A `z.object()` schema block to paste into `schemas.ts`
- `type FormValues = z.infer<typeof mySchema>`
- The component with `useForm<FormValues>({ mode: 'onTouched', resolver: zodResolver(...) })`
- Each field wired with the correct Shadcn control:
  - `text | email | number | textarea` → `register()`
  - `select | checkbox | switch` → `Controller`
- An inline `<FieldError>` helper component
- A `<Section>` wrapper (Card + CardHeader + CardContent) when the form has more than 3 fields
- Submit button with `disabled={isSubmitting}`
- String literals left as `// TODO: extract to strings file` comments

### Conventions enforced
| Rule | Detail |
|------|--------|
| Always `zodResolver` | Never manual `validate` functions |
| `Controller` for non-text inputs | Select, Checkbox, Switch must use `Controller` |
| `register` for text-like inputs | Input, Textarea, number inputs |
| `aria-invalid={!!errors.field}` | On every form control |
| `mode: 'onTouched'` | Default form mode unless overridden |
| No `any` types | Claude must ask for types if missing |

---

## Skill 2: `new-query-component`

### Purpose
Scaffolds a data-display component using TanStack Query with typed fetch calls, loading/error states, and Shadcn UI display primitives.

### Interactive questions (one at a time)
1. Component name and purpose (e.g. "ProductList — displays all products from the API")
2. API endpoint URL pattern and HTTP method (e.g. `GET /api/products`, `GET /api/users/:id`)
3. Display shape: `list | table | card-grid | detail`
4. Data fields to display: names and TypeScript types (e.g. `id: string, name: string, price: number`)
5. Whether pagination, search/filter, or sorting is needed (yes/no per feature)

### Generated output
- A typed response interface: `interface ProductDTO { id: string; name: string; price: number }`
- A query key constant:
  ```ts
  const productKeys = {
    all: ['products'] as const,
    detail: (id: string) => ['products', id] as const,
  }
  ```
- An `async queryFn` using `fetch('/api/...')` with `if (!res.ok) throw new Error(res.statusText)`
- `useQuery({ queryKey, queryFn })` with `data`, `isLoading`, `isError`, `refetch` destructured
- Loading state using Shadcn `Skeleton` blocks sized to match the display shape
- Error state: inline error message + retry button calling `refetch()`
- Display component using the chosen Shadcn primitives (`Table`, `Card`, or plain list)
- If pagination/search/sort requested: local `useState` wired into query params or client-side filtering

### Conventions enforced
| Rule | Detail |
|------|--------|
| Query keys as constants | Never inline string arrays in `useQuery` |
| `async queryFn` with error check | `if (!res.ok) throw new Error(...)` always present |
| Loading guard before render | Never optional-chain through `data` |
| Shadcn `Skeleton` for loading | Never plain text "Loading..." or spinners |
| No `any` types | Claude must ask for field types if not provided |

---

## Shared behavior (both skills)

- **Interactive first** — no code is generated until all questions are answered
- **Generic by default** — no hardcoded project colors, path aliases, or string file assumptions; generated code uses plain Tailwind classes and inline strings with TODO comments
- **One file at a time** — each skill generates output for a single component; multi-file scaffolding (schema + component + route) is shown as clearly separated blocks with instructions on where each block goes
- **TypeScript only** — all generated code is typed; no JS fallbacks
