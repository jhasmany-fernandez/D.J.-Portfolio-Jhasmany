'use client'

import { loginAction } from '@/actions/auth-form'
import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '../UI/Button'
import Input from '../UI/Input'
import Link from 'next/link'

const LoginForm = () => {
  const [status, formAction, isPending] = useActionState(loginAction, null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (status?.success && status.redirect) {
      router.push(status.redirect)
    }
  }, [status, router])

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-secondary border-border rounded-lg border p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-neutral text-2xl font-semibold">Welcome Back</h2>
          <p className="text-tertiary-content mt-2">Sign in to your account</p>
        </div>

        <form action={formAction} className="space-y-4">
          <Input
            label="Email address"
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-secondary-content mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="block w-full px-3 py-2 pr-10 bg-primary border border-border rounded-md text-primary-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-accent transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg
                  className="h-5 w-5 text-secondary-content hover:text-accent transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {showPassword ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {status && (
            <div className={`rounded-md p-3 ${
              status.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm ${
                status.success ? 'text-green-600' : 'text-red-600'
              }`}>
                {status.message}
              </p>
            </div>
          )}

          <Button
            text={isPending ? 'Signing in...' : 'Sign In'}
            disabled={isPending}
          />
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/auth/forgot-password"
            className="text-accent hover:text-accent/80 text-sm transition-colors"
          >
            Forgot your password?
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/auth/register"
            className="text-accent hover:text-accent/80 text-sm transition-colors"
          >
            Don't have an account? Sign up
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-tertiary-content hover:text-neutral text-sm transition-colors"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginForm