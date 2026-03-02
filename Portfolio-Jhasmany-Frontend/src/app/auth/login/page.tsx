import LoginForm from '@/components/Auth/LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Jhasmany Fernandez',
  description: 'Sign in to your account to access exclusive content and features.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}