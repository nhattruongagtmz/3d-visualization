import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { strings } from '../lib/strings'
import { adminLoginSchema } from '../lib/schemas'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface AdminLoginScreenProps {
  onLogin: (password: string) => boolean
}

type LoginForm = z.infer<typeof adminLoginSchema>

export default function AdminLoginScreen({ onLogin }: AdminLoginScreenProps) {
  const { register, handleSubmit, setError, setValue, setFocus, formState: { errors } } =
    useForm<LoginForm>({ resolver: zodResolver(adminLoginSchema) })

  function onSubmit(data: LoginForm) {
    if (!onLogin(data.password)) {
      setValue('password', '')
      setError('password', { message: strings.admin.errorWrongPassword })
      setFocus('password')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-base)] px-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="space-y-3 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--lagoon)]" />
            <span className="text-sm font-semibold tracking-tight">PrintForge</span>
            <span className="rounded-full border border-[var(--lagoon)]/30 bg-[var(--lagoon)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--lagoon)]">
              Admin
            </span>
          </div>
          <div>
            <CardTitle className="text-xl">{strings.admin.loginTitle}</CardTitle>
            <CardDescription className="mt-1">{strings.admin.loginDescription}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-password">{strings.admin.passwordLabel}</Label>
              <Input
                id="admin-password"
                type="password"
                autoFocus
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              {strings.admin.loginButton}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
