'use client'

import { useState } from 'react';
import { useActionState } from 'react';
import Link from 'next/link';
import { forgotPasswordAction } from '@/actions/auth-form';

const ForgotPasswordForm = () => {
  const [status, formAction, isPending] = useActionState(forgotPasswordAction, null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitted(true);
    await formAction(formData);
  };

  if (isSubmitted && status?.success) {
    return (
      <div className="bg-secondary border border-accent/20 rounded-lg p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-accent/10 mb-4">
            <svg
              className="h-6 w-6 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-secondary-content mb-2">
            Check your email
          </h3>
          <p className="text-sm text-neutral mb-4">
            {status.message}
          </p>
          <div className="text-xs text-neutral">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-accent hover:text-accent/80 underline"
            >
              try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="mt-8 space-y-6">
      <div className="bg-secondary border border-border rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary-content">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-primary border border-border rounded-md text-primary-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Enter your email address"
            />
          </div>

          {status?.error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3">
              <p className="text-sm text-red-400">{status.error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </div>
            ) : (
              'Send reset link'
            )}
          </button>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/auth/login"
          className="text-sm text-accent hover:text-accent/80 transition-colors"
        >
          ← Back to login
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;