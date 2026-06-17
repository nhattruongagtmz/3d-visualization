import { Link } from '@tanstack/react-router'
import { strings } from '@lib/strings'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
      <div className="page-wrap">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-[var(--lagoon)]" />
              <span className="font-semibold text-[var(--sea-ink)]">PrintForge</span>
            </div>
            <p className="text-sm max-w-xs">{strings.footer.tagline}</p>
          </div>

          <div className="flex gap-12 text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-[var(--sea-ink)]">{strings.footer.shopHeading}</p>
              <Link to="/shop" className="block hover:text-[var(--sea-ink)] no-underline">{strings.footer.allProducts}</Link>
              <Link to="/shop" className="block hover:text-[var(--sea-ink)] no-underline">{strings.footer.homeDecor}</Link>
              <Link to="/shop" className="block hover:text-[var(--sea-ink)] no-underline">{strings.footer.functionalParts}</Link>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-[var(--sea-ink)]">{strings.footer.companyHeading}</p>
              <Link to="/about" className="block hover:text-[var(--sea-ink)] no-underline">{strings.footer.about}</Link>
              <Link to="/cart" className="block hover:text-[var(--sea-ink)] no-underline">{strings.footer.cart}</Link>
              <Link to="/about" className="block hover:text-[var(--sea-ink)] no-underline">{strings.footer.privacy}</Link>
              <Link to="/about" className="block hover:text-[var(--sea-ink)] no-underline">{strings.footer.terms}</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[var(--line)] pt-6 sm:flex-row">
          <p className="text-sm">{strings.footer.copyright(year)}</p>
          <p className="island-kicker">{strings.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  )
}
