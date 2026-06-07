import { Star } from 'lucide-react'
import { cn } from '../lib/utils'

interface StarRatingProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
  className?: string
}

export default function StarRating({ rating, reviewCount, size = 'sm', className }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i + 1 <= Math.floor(rating)
    const partial = !filled && i < rating
    return { filled, partial }
  })

  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {stars.map((star, i) => (
          <Star
            key={i}
            className={cn(
              iconSize,
              star.filled
                ? 'fill-amber-400 text-amber-400'
                : star.partial
                  ? 'fill-amber-200 text-amber-400'
                  : 'fill-none text-[var(--line)]',
            )}
          />
        ))}
      </div>
      <span className="text-xs text-[var(--sea-ink-soft)]">
        {rating.toFixed(1)}
        {reviewCount !== undefined && (
          <span className="ml-1">({reviewCount.toLocaleString()})</span>
        )}
      </span>
    </div>
  )
}
