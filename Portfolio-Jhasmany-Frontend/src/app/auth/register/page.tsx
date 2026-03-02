import RegisterForm from '@/components/Auth/RegisterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register | Jhasmany Fernandez',
  description: 'Create your account to get access to exclusive content and features.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}