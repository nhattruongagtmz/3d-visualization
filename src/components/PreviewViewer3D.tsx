import { useState, useEffect, lazy, Suspense } from 'react'
import { strings } from '#/lib/strings'

const PreviewViewer3DScene = lazy(() => import('./PreviewViewer3DScene'))

export default function PreviewViewer3D({
  url,
  fileExt,
}: {
  url: string
  fileExt: 'glb' | 'gltf' | 'stl'
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <ViewerSkeleton />

  return (
    <div
      className="relative h-[500px] w-full overflow-hidden rounded-2xl md:h-[600px]"
      style={{ background: 'radial-gradient(ellipse at 50% 35%, #1c2d4a 0%, #080d18 100%)' }}
    >
      <Suspense fallback={<ViewerSkeleton />}>
        <PreviewViewer3DScene key={url} url={url} fileExt={fileExt} />
      </Suspense>
    </div>
  )
}

function ViewerSkeleton() {
  return (
    <div
      className="flex h-[500px] w-full items-center justify-center rounded-2xl md:h-[600px]"
      style={{ background: 'radial-gradient(ellipse at 50% 35%, #1c2d4a 0%, #080d18 100%)' }}
    >
      <div className="flex flex-col items-center gap-3 text-[var(--sea-ink-soft)]">
        <div className="h-10 w-10 animate-spin rounded-md border-2 border-[var(--lagoon)] border-t-transparent" />
        <span className="text-sm font-medium">{strings.preview.loadingModel}</span>
      </div>
    </div>
  )
}
