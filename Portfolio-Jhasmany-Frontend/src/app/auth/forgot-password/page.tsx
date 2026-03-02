import { Metadata } from 'next';
import ForgotPasswordForm from '@/components/Auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password | Portfolio Jhasmany',
  description: 'Reset your password to access your account',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-primary-content">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-neutral">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}