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
