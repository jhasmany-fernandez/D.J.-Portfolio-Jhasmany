'use client'

import { registerAction } from '@/actions/auth-form'
import { useActionState, useState } from 'react'
import Button from '../UI/Button'
import Input from '../UI/Input'
import Link from 'next/link'

const RegisterForm = () => {
  const [status, formAction, isPending] = useActionState(registerAction, null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  if (status?.success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-secondary border-border rounded-lg border p-8 shadow-lg text-center">
          <div className="mb-6">
            <div className="text-accent mx-auto mb-4 text-5xl">✓</div>
            <h2 className="text-neutral text-2xl font-semibold">Account Created!</h2>
            <p className="text-tertiary-content mt-2">{status.message}</p>
          </div>
          <Link
            href="/auth/login"
            className="bg-accent hover:bg-accent/80 text-secondary inline-block w-full cursor-pointer rounded-lg px-4 py-2 transition-colors duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-secondary border-border rounded-lg border p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-neutral text-2xl font-semibold">Create Account</h2>
          <p className="text-tertiary-content mt-2">Join us and start your journey</p>
        </div>

        <form action={formAction} className="space-y-4">
          <Input
            label="Full name"
            id="name"
            name="name"
            placeholder="Enter your full name"
            required
          />
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
                autoComplete="new-password"
                required
                className="block w-full px-3 py-2 pr-10 bg-primary border border-border rounded-md text-primary-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Create a password"
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-content mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="block w-full px-3 py-2 pr-10 bg-primary border border-border rounded-md text-primary-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-accent transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <svg
                  className="h-5 w-5 text-secondary-content hover:text-accent transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {showConfirmPassword ? (
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

          {status && !status.success && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{status.message}</p>
            </div>
          )}

          <Button
            text={isPending ? 'Creating Account...' : 'Create Account'}
            disabled={isPending}
          />
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="text-accent hover:text-accent/80 text-sm transition-colors"
          >
            Already have an account? Sign in
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

export default RegisterForm