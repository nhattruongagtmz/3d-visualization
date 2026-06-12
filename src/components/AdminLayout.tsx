import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { LayoutDashboard, LogOut, Menu, Package, ShieldCheck, Tag, X } from 'lucide-react'
import { strings } from '../lib/strings'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'

interface AdminLayoutProps {
  children: React.ReactNode
  onLogout: () => void
  activeTab: string
  onTabChange: (tab: string) => void
}

const NAV_ITEMS = [
  { id: 'overview', label: strings.admin.sidebarDashboard, Icon: LayoutDashboard },
  { id: 'products', label: strings.admin.sidebarProducts, Icon: Package },
  { id: 'categories', label: strings.admin.sidebarCategories, Icon: Tag },
] as const

function SidebarContent({
  activeTab,
  onTabChange,
  onClose,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
  onClose?: () => void
}) {
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
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => {
                onTabChange(id)
                onClose?.()
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--lagoon)]/10 text-[var(--lagoon)]'
                  : 'text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]'
              }`}
            >
              <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-[var(--lagoon)]' : ''}`} />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Admin badge */}
      <div className="flex items-center gap-2 border-t border-[var(--line)] px-4 py-3">
        <ShieldCheck className="h-4 w-4 text-[var(--sea-ink-soft)]" />
        <span className="text-xs text-[var(--sea-ink-soft)]">{strings.admin.adminBadge}</span>
      </div>
    </div>
  )
}

export default function AdminLayout({ children, onLogout, activeTab, onTabChange }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="fixed inset-0 z-40 flex bg-[var(--bg-base)]">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--line)] bg-[var(--foam)] dark:bg-[var(--surface-strong,#0f1117)] md:flex">
        <SidebarContent activeTab={activeTab} onTabChange={onTabChange} />
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
              <SidebarContent
                activeTab={activeTab}
                onTabChange={onTabChange}
                onClose={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>

          {/* Page title */}
          <h1 className="text-sm font-semibold text-[var(--sea-ink)]">
            {strings.admin.sidebarDashboard}
          </h1>

          <div className="ml-auto flex items-center gap-2">
            {/* Back to store */}
            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] sm:flex"
            >
              ← {strings.admin.backToStore}
            </Link>

            {/* Admin avatar */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--lagoon)] text-[11px] font-bold text-white">
              A
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
