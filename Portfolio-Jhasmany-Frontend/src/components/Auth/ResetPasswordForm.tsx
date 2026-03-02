'use client'

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { resetPasswordAction } from '@/actions/auth-form';

const ResetPasswordForm = () => {
  const [status, formAction, isPending] = useActionState(resetPasswordAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValidation, setTokenValidation] = useState<{ valid: boolean; message: string } | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenValidation({ valid: false, message: 'No reset token provided' });
      setIsValidating(false);
      return;
    }

    // Validate token
    const validateToken = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/validate-reset-token?token=${token}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        });


        const result = await response.json();

        if (!response.ok) {
          setTokenValidation({ valid: false, message: result.message || 'Token inválido' });
        } else {
          setTokenValidation(result);
        }
      } catch (error) {
        console.error('💥 Token validation error:', error);
        setTokenValidation({ valid: false, message: 'Failed to validate token' });
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  useEffect(() => {
    if (status?.success) {
      // Redirect to login after successful password reset
      setTimeout(() => {
        router.push('/auth/login?message=Password reset successful. Please log in with your new password.');
      }, 3000);
    }
  }, [status, router]);

  if (isValidating) {
    return (
      <div className="bg-secondary border border-border rounded-lg p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-sm text-neutral">Validating reset token...</p>
        </div>
      </div>
    );
  }

  if (!token || !tokenValidation?.valid) {
    return (
      <div className="bg-secondary border border-red-500/20 rounded-lg p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10 mb-4">
            <svg
              className="h-6 w-6 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-400 mb-2">
            Invalid Reset Link
          </h3>
          <p className="text-sm text-neutral mb-4">
            {tokenValidation?.message || 'The password reset link is invalid or has expired.'}
          </p>
          <Link
            href="/auth/forgot-password"
            className="text-accent hover:text-accent/80 underline text-sm"
          >
            Request a new password reset link
          </Link>
        </div>
      </div>
    );
  }

  if (status?.success) {
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
            Password Reset Successful
          </h3>
          <p className="text-sm text-neutral mb-4">
            Your password has been successfully reset. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (formData: FormData) => {
    formData.append('token', token!);
    await formAction(formData);
  };

  return (
    <form action={handleSubmit} className="mt-8 space-y-6">
      <div className="bg-secondary border border-border rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-secondary-content">
              New Password
            </label>
            <div className="mt-1 relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="block w-full px-3 py-2 pr-10 bg-primary border border-border rounded-md text-primary-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Enter your new password"
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
            <p className="mt-1 text-xs text-neutral">
              Must be at least 8 characters with uppercase, lowercase, number, and special character
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-content">
              Confirm New Password
            </label>
            <div className="mt-1 relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="block w-full px-3 py-2 pr-10 bg-primary border border-border rounded-md text-primary-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Confirm your new password"
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
                Resetting...
              </div>
            ) : (
              'Reset password'
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

export default ResetPasswordForm;
