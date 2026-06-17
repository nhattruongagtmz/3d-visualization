import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import AdminLoginScreen from '@components/AdminLoginScreen'

const ADMIN_PASSWORD = 'admin'
const SESSION_KEY = 'admin_auth'

export const Route = createFileRoute('/admin-login')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === 'true') {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const navigate = useNavigate()

  function handleLogin(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      navigate({ to: '/dashboard' })
      return true
    }
    return false
  }

  return <AdminLoginScreen onLogin={handleLogin} />
}
