'use client'

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const NewsletterConfirmation = () => {
  const [confirmationStatus, setConfirmationStatus] = useState<{
    success: boolean;
    message: string;
    alreadyConfirmed?: boolean;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setConfirmationStatus({
        success: false,
        message: 'No confirmation token provided'
      });
      setIsProcessing(false);
      return;
    }

    const confirmSubscription = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/confirm?token=${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        setConfirmationStatus(result);

        // Redirect to homepage after successful confirmation
        if (result.success && !result.alreadyConfirmed) {
          setTimeout(() => {
            router.push('/?newsletter=confirmed');
          }, 5000);
        }
      } catch {
        setConfirmationStatus({
          success: false,
          message: 'Failed to confirm subscription. Please try again.'
        });
      } finally {
        setIsProcessing(false);
      }
    };

    confirmSubscription();
  }, [token, router]);

  if (isProcessing) {
    return (
      <div className="bg-secondary border border-border rounded-lg p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-sm text-neutral">Confirming your subscription...</p>
        </div>
      </div>
    );
  }

  if (!confirmationStatus) {
    return (
      <div className="bg-secondary border border-red-500/20 rounded-lg p-6">
        <div className="text-center">
          <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
        </div>
      </div>
    );
  }

  if (!confirmationStatus.success) {
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
            Confirmation Failed
          </h3>
          <p className="text-sm text-neutral mb-4">
            {confirmationStatus.message}
          </p>
          <Link
            href="/newsletter/subscribe"
            className="text-accent hover:text-accent/80 underline text-sm"
          >
            Try subscribing again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary border border-accent/20 rounded-lg p-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-accent/10 mb-4">
          {confirmationStatus.alreadyConfirmed ? (
            <svg
              className="h-8 w-8 text-accent"
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
          ) : (
            <svg
              className="h-8 w-8 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>
        <h3 className="text-lg font-medium text-secondary-content mb-2">
          {confirmationStatus.alreadyConfirmed ? '✅ Already Confirmed!' : '🎉 Subscription Confirmed!'}
        </h3>
        <p className="text-sm text-neutral mb-4">
          {confirmationStatus.message}
        </p>
        {!confirmationStatus.alreadyConfirmed && (
          <div className="bg-primary/50 border border-border rounded-md p-4 mb-4">
            <p className="text-xs text-neutral">
              📧 Your portfolio catalog is on its way! Check your email inbox.
            </p>
          </div>
        )}
        <div className="space-y-2">
          <Link
            href="/#projects"
            className="block text-accent hover:text-accent/80 underline text-sm"
          >
            Browse Our Portfolio
          </Link>
          <Link
            href="/#contact"
            className="block text-accent hover:text-accent/80 underline text-sm"
          >
            Get In Touch
          </Link>
        </div>
        {!confirmationStatus.alreadyConfirmed && (
          <p className="text-xs text-neutral mt-4">
            Redirecting to homepage in 5 seconds...
          </p>
        )}
      </div>
    </div>
  );
};

export default NewsletterConfirmation;