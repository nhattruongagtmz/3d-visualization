import { useEffect, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronRight, LayoutDashboard, LogOut, Menu, Package, Plus, ShieldCheck, Tag, X } from 'lucide-react'
import { strings } from '@lib/strings'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

interface AdminLayoutProps {
  children: React.ReactNode
  onLogout: () => void
  adminName?: string
}

function formatClock() {
  return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

const NAV_ITEMS = [
  { path: '/dashboard',            label: strings.admin.sidebarDashboard,   Icon: LayoutDashboard },
  { path: '/dashboard/products',   label: strings.admin.sidebarProducts,    Icon: Package },
  { path: '/dashboard/categories', label: strings.admin.sidebarCategories,  Icon: Tag },
] as const

const BREADCRUMB_MAP: Record<string, string> = {
  '/dashboard':            strings.dashboard.tabOverview,
  '/dashboard/products':   strings.dashboard.tabProducts,
  '/dashboard/categories': strings.dashboard.tabCategories,
  '/create-product':       strings.admin.createProduct,
}

function isNavActive(itemPath: string, pathname: string): boolean {
  if (itemPath === '/dashboard') return pathname === '/dashboard' || pathname === '/dashboard/'
  return pathname.startsWith(itemPath)
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { location: { pathname } } = useRouterState()

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--lagoon)]" />
        <span className="text-sm font-semibold tracking-tight">PrintForge</span>
        <span className="rounded-full border border-[var(--lagoon)]/30 bg-[var(--lagoon)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--lagoon)]">
          Admin
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto rounded-md p-1 text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2 py-4">
        {NAV_ITEMS.map(({ path, label, Icon }) => {
          const active = isNavActive(path, pathname)
          return (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-[var(--lagoon)]/10 text-[var(--lagoon)]'
                  : 'text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]'
              }`}
            >
              <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-[var(--lagoon)]' : ''}`} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Create product quick link */}
      <div className="border-t border-[var(--line)] px-2 py-2">
        <Link
          to="/create-product"
          onClick={onClose}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            pathname.startsWith('/create-product')
              ? 'bg-[var(--lagoon)]/10 text-[var(--lagoon)]'
              : 'text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]'
          }`}
        >
          <Plus className="h-4 w-4 shrink-0 text-[var(--lagoon)]" />
          {strings.admin.createProduct}
        </Link>
      </div>

      {/* Admin badge */}
      <div className="flex items-center gap-2 border-t border-[var(--line)] px-4 py-3">
        <ShieldCheck className="h-4 w-4 text-[var(--sea-ink-soft)]" />
        <span className="text-xs text-[var(--sea-ink-soft)]">{strings.admin.adminBadge}</span>
      </div>
    </div>
  )
}

export default function AdminLayout({ children, onLogout, adminName = 'Admin' }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [clock, setClock] = useState(formatClock)
  const { location: { pathname } } = useRouterState()

  useEffect(() => {
    const id = setInterval(() => setClock(formatClock()), 60_000)
    return () => clearInterval(id)
  }, [])

  const initials = adminName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const breadcrumbLabel = BREADCRUMB_MAP[pathname] ?? strings.dashboard.tabOverview

  return (
    <div className="fixed inset-0 z-40 flex bg-[var(--bg-base)]">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--line)] bg-[var(--foam)] dark:bg-[var(--surface-strong,#0f1117)] md:flex">
        <SidebarContent />
      </aside>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Mở menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0">
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Page title + breadcrumb */}
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold leading-tight text-[var(--sea-ink)]">
              {strings.admin.sidebarDashboard}
            </h1>
            <nav aria-label="breadcrumb" className="flex items-center gap-1 text-[10px] text-[var(--sea-ink-soft)]">
              <span>{strings.dashboard.breadcrumbDashboard}</span>
              <ChevronRight className="h-2.5 w-2.5 opacity-40" />
              <span className="font-medium text-[var(--sea-ink)]">{breadcrumbLabel}</span>
            </nav>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Live clock */}
            <span className="hidden tabular-nums text-xs font-medium text-[var(--sea-ink-soft)] sm:block">
              {clock}
            </span>

            {/* Divider */}
            <span className="hidden h-4 w-px bg-[var(--line)] sm:block" />

            {/* Back to store */}
            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] sm:flex"
            >
              ← {strings.admin.backToStore}
            </Link>

            {/* Admin avatar with initials */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--lagoon)] text-[11px] font-bold text-white">
              {initials}
            </div>

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="gap-1.5 text-xs text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{strings.admin.logoutButton}</span>
            </Button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
