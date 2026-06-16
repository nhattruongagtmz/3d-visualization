import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'

const SESSION_KEY = 'admin_auth'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) !== 'true') {
      throw redirect({ to: '/admin-login' })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const navigate = useNavigate()
  const [sessionVerified, setSessionVerified] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) !== 'true') {
      navigate({ to: '/admin-login' })
    } else {
      setSessionVerified(true)
    }
  }, [navigate])

  if (!sessionVerified) return null

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
