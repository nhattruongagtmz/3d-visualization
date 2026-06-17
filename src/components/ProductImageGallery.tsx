import { useState } from 'react'
import { ZoomIn } from 'lucide-react'
import { cn } from '@lib/utils'
import { Dialog, DialogContent } from './ui/dialog'

export default function ProductImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <div className="space-y-3">
      <div
        className="relative cursor-zoom-in overflow-hidden rounded-2xl bg-[var(--surface)]"
        onClick={() => setLightboxOpen(true)}
      >
        <img
          src={images[active]}
          alt={name}
          className="h-80 w-full object-cover md:h-96"
        />
        <div className="absolute bottom-3 right-3 rounded-full bg-black/30 p-1.5 text-white backdrop-blur-sm">
          <ZoomIn className="h-4 w-4" />
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                active === i
                  ? 'border-[var(--lagoon)] opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-80',
              )}
            >
              <img src={src} alt={`${name} view ${i + 1}`} className="h-16 w-16 object-cover" />
            </button>
          ))}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-3xl p-2">
          <img
            src={images[active]}
            alt={name}
            className="max-h-[80vh] w-full rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
