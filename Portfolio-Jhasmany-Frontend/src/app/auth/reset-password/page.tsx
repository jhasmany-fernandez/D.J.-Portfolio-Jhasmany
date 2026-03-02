import { Metadata } from 'next';
import { Suspense } from 'react';
import ResetPasswordForm from '@/components/Auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password | Portfolio Jhasmany',
  description: 'Create a new password for your account',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-primary-content">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-neutral">
            Enter your new password below
          </p>
        </div>
        <Suspense fallback={<div className="text-center text-neutral">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}