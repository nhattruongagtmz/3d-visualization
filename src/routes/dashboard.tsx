import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import AdminLayout from '@components/AdminLayout'

const SESSION_KEY = 'admin_auth'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    const isAuthed = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === 'true'
    if (!isAuthed) {
      throw redirect({ to: '/admin-login' })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const navigate = useNavigate()

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY)
    navigate({ to: '/admin-login' })
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <Outlet />
    </AdminLayout>
  )
}
