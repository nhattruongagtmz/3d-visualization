import { Link } from '@tanstack/react-router'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
      <div className="page-wrap">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
              <span className="font-semibold text-[var(--sea-ink)]">PrintForge</span>
            </div>
            <p className="text-sm max-w-xs">
              Original 3D-printed models, made fresh on Bambu Lab hardware and shipped to your door.
            </p>
          </div>

          <div className="flex gap-12 text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-[var(--sea-ink)]">Shop</p>
              <Link to="/shop" className="block hover:text-[var(--sea-ink)] no-underline">All Products</Link>
              <Link to="/shop" className="block hover:text-[var(--sea-ink)] no-underline">Home Decor</Link>
              <Link to="/shop" className="block hover:text-[var(--sea-ink)] no-underline">Functional Parts</Link>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-[var(--sea-ink)]">Company</p>
              <Link to="/about" className="block hover:text-[var(--sea-ink)] no-underline">About</Link>
              <Link to="/cart" className="block hover:text-[var(--sea-ink)] no-underline">Cart</Link>
              <Link to="/about" className="block hover:text-[var(--sea-ink)] no-underline">Privacy policy</Link>
              <Link to="/about" className="block hover:text-[var(--sea-ink)] no-underline">Terms of service</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[var(--line)] pt-6 sm:flex-row">
          <p className="text-sm">&copy; {year} PrintForge. All rights reserved.</p>
          <p className="island-kicker">Printed with care on Bambu Lab</p>
        </div>
      </div>
    </footer>
  )
}
