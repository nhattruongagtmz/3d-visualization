import { useState, useEffect, lazy, Suspense } from 'react'

const ProductViewer3DScene = lazy(() => import('./ProductViewer3DScene'))

export default function ProductViewer3D({ modelUrl }: { modelUrl: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <ViewerSkeleton />

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-[var(--surface)] md:h-96">
      <Suspense fallback={<ViewerSkeleton />}>
        <ProductViewer3DScene modelUrl={modelUrl} />
      </Suspense>
    </div>
  )
}

function ViewerSkeleton() {
  return (
    <div className="flex h-80 w-full items-center justify-center rounded-2xl bg-[var(--surface)] md:h-96">
      <div className="flex flex-col items-center gap-3 text-[var(--sea-ink-soft)]">
        <div className="h-10 w-10 animate-spin rounded-md border-2 border-[var(--lagoon)] border-t-transparent" />
        <span className="text-sm font-medium">Loading 3D model…</span>
      </div>
    </div>
  )
}
