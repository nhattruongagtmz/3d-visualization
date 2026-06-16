import { createFileRoute, redirect, useNavigate, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { CheckCircle2, Package } from 'lucide-react'
import { motion } from 'motion/react'
import { strings } from '../lib/strings'
import { createProductSchema } from '../lib/schemas'
import type { Product, Category, Material, PrinterCompatibility } from '../lib/types'
import AdminLayout from '../components/AdminLayout'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Checkbox } from '../components/ui/checkbox'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Separator } from '../components/ui/separator'
import { Switch } from '../components/ui/switch'
import { Textarea } from '../components/ui/textarea'

// ── Auth ──────────────────────────────────────────────────────────────────────

const SESSION_KEY = 'admin_auth'

export const Route = createFileRoute('/create-product')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) !== 'true') {
      throw redirect({ to: '/admin-login' })
    }
  },
  component: CreateProductPage,
})

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'home-decor',       label: strings.productDetail.categoryLabels['home-decor'] },
  { value: 'toys',             label: strings.productDetail.categoryLabels['toys'] },
  { value: 'tools',            label: strings.productDetail.categoryLabels['tools'] },
  { value: 'art',              label: strings.productDetail.categoryLabels['art'] },
  { value: 'functional-parts', label: strings.productDetail.categoryLabels['functional-parts'] },
]

const MATERIALS: Material[] = ['PLA', 'PETG', 'ABS', 'ASA', 'TPU', 'PA', 'PC']

const PRINTERS: PrinterCompatibility[] = ['X1C', 'X1E', 'P1S', 'P1P', 'A1', 'A1 Mini', 'All']

const LAYER_HEIGHTS = ['0.1', '0.15', '0.2', '0.25'] as const

// ── Types ─────────────────────────────────────────────────────────────────────

type FormValues = z.infer<typeof createProductSchema>

function generateId(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${slug}-${Date.now().toString(36)}`
}

function buildProduct(data: FormValues): Product {
  return {
    id: generateId(data.name),
    name: data.name,
    tagline: data.tagline,
    description: data.description,
    price: Math.round(parseFloat(data.priceDisplay) * 100),
    images: data.imageUrls.split('\n').map((u) => u.trim()).filter(Boolean),
    modelUrl: data.modelUrl || undefined,
    category: data.category,
    materials: data.materials as Material[],
    printerCompatibility: data.printerCompatibility as PrinterCompatibility[],
    layerHeight: parseFloat(data.layerHeight),
    printTime: data.printTime,
    supportRequired: data.supportRequired,
    featured: data.featured,
    inStock: data.inStock,
    rating: 0,
    reviewCount: 0,
    tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
  }
}

// ── Field error helper ────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-destructive">{message}</p>
}

// ── Section card ──────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-[var(--sea-ink)]">{title}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5 space-y-4">{children}</CardContent>
    </Card>
  )
}

// ── Success state ─────────────────────────────────────────────────────────────

function SuccessState({
  product,
  onReset,
}: {
  product: Product
  onReset: () => void
}) {
  const navigate = useNavigate()
  const s = strings.createProduct

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-[60vh] items-center justify-center"
    >
      <Card className="w-full max-w-md text-center">
        <CardContent className="px-8 py-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2
            className="mb-1 text-xl font-bold text-[var(--sea-ink)]"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {s.successTitle}
          </h2>
          <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">{s.successDesc(product.name)}</p>

          {/* Product preview pill */}
          <div className="mb-8 rounded-xl border border-[var(--line)] bg-[var(--foam)] p-4 text-left dark:bg-[var(--sand)]/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lagoon)]/10">
                <Package className="h-5 w-5 text-[var(--lagoon)]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--sea-ink)]">{product.name}</p>
                <p className="text-xs text-[var(--sea-ink-soft)]">
                  {strings.productDetail.categoryLabels[product.category]} · ${(product.price / 100).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {product.materials.map((m) => (
                <Badge key={m} variant="secondary" className="text-[10px]">{m}</Badge>
              ))}
              {product.featured && (
                <Badge className="bg-[var(--lagoon)] text-[10px] text-white">{strings.dashboard.statusFeatured}</Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={onReset} variant="outline" className="w-full">
              {s.successCreateAnother}
            </Button>
            <Button onClick={() => navigate({ to: '/dashboard' })} className="w-full">
              {s.successViewDashboard}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── Create product form ───────────────────────────────────────────────────────

function CreateProductForm({ onSuccess }: { onSuccess: (p: Product) => void }) {
  const s = strings.createProduct

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      materials: [],
      printerCompatibility: [],
      supportRequired: false,
      featured: false,
      inStock: true,
      layerHeight: '0.2',
    },
  })

  function onSubmit(data: FormValues) {
    onSuccess(buildProduct(data))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* ── Basic Info ── */}
      <Section title={s.sBasic}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">{s.fName} <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              placeholder={s.pName}
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            <FieldError message={errors.name?.message} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tagline">{s.fTagline} <span className="text-destructive">*</span></Label>
            <Input
              id="tagline"
              placeholder={s.pTagline}
              aria-invalid={!!errors.tagline}
              {...register('tagline')}
            />
            <FieldError message={errors.tagline?.message} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="description">{s.fDescription} <span className="text-destructive">*</span></Label>
          <Textarea
            id="description"
            placeholder={s.pDescription}
            rows={4}
            aria-invalid={!!errors.description}
            className="resize-none"
            {...register('description')}
          />
          <FieldError message={errors.description?.message} />
        </div>
      </Section>

      {/* ── Pricing & Status ── */}
      <Section title={s.sPricing}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="price">{s.fPrice} <span className="text-destructive">*</span></Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--sea-ink-soft)]">$</span>
              <Input
                id="price"
                placeholder={s.pPrice}
                className="pl-6"
                aria-invalid={!!errors.priceDisplay}
                {...register('priceDisplay')}
              />
            </div>
            <FieldError message={errors.priceDisplay?.message} />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[var(--line)] px-4 py-3">
            <div>
              <p className="text-sm font-medium text-[var(--sea-ink)]">{s.fInStock}</p>
              <p className="text-xs text-[var(--sea-ink-soft)]">Hiển thị là còn hàng</p>
            </div>
            <Controller
              control={control}
              name="inStock"
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[var(--line)] px-4 py-3">
            <div>
              <p className="text-sm font-medium text-[var(--sea-ink)]">{s.fFeatured}</p>
              <p className="text-xs text-[var(--sea-ink-soft)]">Hiển thị trên trang chủ</p>
            </div>
            <Controller
              control={control}
              name="featured"
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
        </div>
      </Section>

      {/* ── Category ── */}
      <Section title={s.sClassify}>
        <div className="space-y-1.5">
          <Label>{s.fCategory} <span className="text-destructive">*</span></Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-invalid={!!errors.category}>
                  <SelectValue placeholder="Chọn danh mục..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.category?.message} />
        </div>
      </Section>

      {/* ── Materials ── */}
      <Section title={s.sMaterials}>
        <Controller
          control={control}
          name="materials"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {MATERIALS.map((m) => (
                <label
                  key={m}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[var(--line)] px-3 py-2.5 transition-colors hover:bg-[var(--foam)] has-[:checked]:border-[var(--lagoon)] has-[:checked]:bg-[var(--lagoon)]/5"
                >
                  <Checkbox
                    checked={field.value?.includes(m)}
                    onCheckedChange={(checked) => {
                      const next = checked
                        ? [...(field.value || []), m]
                        : (field.value || []).filter((v) => v !== m)
                      field.onChange(next)
                    }}
                    className="data-[state=checked]:border-[var(--lagoon)] data-[state=checked]:bg-[var(--lagoon)]"
                  />
                  <span className="text-sm font-medium text-[var(--sea-ink)]">{m}</span>
                </label>
              ))}
            </div>
          )}
        />
        <FieldError message={errors.materials?.message} />
      </Section>

      {/* ── Printer Compatibility ── */}
      <Section title={s.sPrinters}>
        <Controller
          control={control}
          name="printerCompatibility"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PRINTERS.map((p) => (
                <label
                  key={p}
                  className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[var(--line)] px-3 py-2.5 transition-colors hover:bg-[var(--foam)] has-[:checked]:border-[var(--lagoon)] has-[:checked]:bg-[var(--lagoon)]/5"
                >
                  <Checkbox
                    checked={field.value?.includes(p)}
                    onCheckedChange={(checked) => {
                      const next = checked
                        ? [...(field.value || []), p]
                        : (field.value || []).filter((v) => v !== p)
                      field.onChange(next)
                    }}
                    className="data-[state=checked]:border-[var(--lagoon)] data-[state=checked]:bg-[var(--lagoon)]"
                  />
                  <span className="text-sm font-medium text-[var(--sea-ink)]">{p}</span>
                </label>
              ))}
            </div>
          )}
        />
        <FieldError message={errors.printerCompatibility?.message} />
      </Section>

      {/* ── Print Specs ── */}
      <Section title={s.sPrintSpecs}>
        <div className="space-y-1.5">
          <Label>{s.fLayerHeight} <span className="text-destructive">*</span></Label>
          <Controller
            control={control}
            name="layerHeight"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {LAYER_HEIGHTS.map((h) => (
                  <label
                    key={h}
                    className={`flex cursor-pointer flex-col rounded-xl border px-3 py-2.5 transition-colors hover:bg-[var(--foam)] ${
                      field.value === h
                        ? 'border-[var(--lagoon)] bg-[var(--lagoon)]/5'
                        : 'border-[var(--line)]'
                    }`}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      value={h}
                      checked={field.value === h}
                      onChange={() => field.onChange(h)}
                    />
                    <span
                      className="font-mono text-sm font-bold text-[var(--lagoon)]"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {h} mm
                    </span>
                    <span className="mt-0.5 text-[10px] text-[var(--sea-ink-soft)]">
                      {s.layerHeightLabels[h]?.split('—')[1]?.trim()}
                    </span>
                  </label>
                ))}
              </div>
            )}
          />
          <FieldError message={errors.layerHeight?.message} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="printTime">{s.fPrintTime} <span className="text-destructive">*</span></Label>
            <Input
              id="printTime"
              placeholder={s.pPrintTime}
              aria-invalid={!!errors.printTime}
              {...register('printTime')}
            />
            <FieldError message={errors.printTime?.message} />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[var(--line)] px-4 py-3">
            <div>
              <p className="text-sm font-medium text-[var(--sea-ink)]">{s.fSupportRequired}</p>
              <p className="text-xs text-[var(--sea-ink-soft)]">Cần in đế đỡ</p>
            </div>
            <Controller
              control={control}
              name="supportRequired"
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
        </div>
      </Section>

      {/* ── Media ── */}
      <Section title={s.sMedia}>
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="imageUrls">{s.fImageUrls} <span className="text-destructive">*</span></Label>
            <span className="text-xs text-[var(--sea-ink-soft)]">{s.fImageUrlsHint}</span>
          </div>
          <Textarea
            id="imageUrls"
            placeholder={s.pImageUrls}
            rows={3}
            className="resize-none font-mono text-xs"
            aria-invalid={!!errors.imageUrls}
            {...register('imageUrls')}
          />
          <FieldError message={errors.imageUrls?.message} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="modelUrl">{s.fModelUrl}</Label>
            <span className="text-xs text-[var(--sea-ink-soft)]">{s.fModelUrlHint}</span>
          </div>
          <Input
            id="modelUrl"
            placeholder={s.pModelUrl}
            className="font-mono text-xs"
            {...register('modelUrl')}
          />
        </div>
      </Section>

      {/* ── Tags ── */}
      <Section title={s.sMeta}>
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="tags">{s.fTags}</Label>
            <span className="text-xs text-[var(--sea-ink-soft)]">{s.fTagsHint}</span>
          </div>
          <Input
            id="tags"
            placeholder={s.pTags}
            {...register('tags')}
          />
        </div>
      </Section>

      {/* ── Submit ── */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <Button type="button" variant="outline" asChild>
          <Link to="/dashboard">{strings.createProduct.back}</Link>
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[var(--lagoon)] text-white hover:bg-[var(--lagoon-deep)] min-w-[140px]"
        >
          {isSubmitting ? '...' : s.submitBtn}
        </Button>
      </div>
    </form>
  )
}

// ── Page header ───────────────────────────────────────────────────────────────

function PageHeader() {
  const s = strings.createProduct
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1
          className="text-2xl font-bold text-[var(--sea-ink)]"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {s.pageTitle}
        </h1>
        <p className="mt-0.5 text-sm text-[var(--sea-ink-soft)]">
          Điền thông tin bên dưới để thêm sản phẩm mới vào cửa hàng.
        </p>
      </div>
      <Button variant="outline" size="sm" asChild className="hidden sm:flex">
        <Link to="/dashboard">{s.back}</Link>
      </Button>
    </div>
  )
}

// ── Route entry ───────────────────────────────────────────────────────────────

function CreateProductPage() {
  const navigate = useNavigate()
  const [sessionVerified, setSessionVerified] = useState(false)
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) !== 'true') {
      navigate({ to: '/admin-login' })
    } else {
      setSessionVerified(true)
    }
  }, [navigate])

  if (!sessionVerified) return null

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY)
    navigate({ to: '/admin-login' })
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      {createdProduct ? (
        <SuccessState
          product={createdProduct}
          onReset={() => setCreatedProduct(null)}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PageHeader />
          <CreateProductForm onSuccess={setCreatedProduct} />
        </motion.div>
      )}
    </AdminLayout>
  )
}
