'use client'

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const NewsletterUnsubscribe = () => {
  const [unsubscribeStatus, setUnsubscribeStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setUnsubscribeStatus({
        success: false,
        message: 'No unsubscribe token provided'
      });
      setIsProcessing(false);
      return;
    }

    const unsubscribeFromNewsletter = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/unsubscribe?token=${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        setUnsubscribeStatus(result);

        // Redirect to homepage after successful unsubscribe
        if (result.success) {
          setTimeout(() => {
            router.push('/');
          }, 5000);
        }
      } catch {
        setUnsubscribeStatus({
          success: false,
          message: 'Failed to unsubscribe. Please try again.'
        });
      } finally {
        setIsProcessing(false);
      }
    };

    unsubscribeFromNewsletter();
  }, [token, router]);

  if (isProcessing) {
    return (
      <div className="bg-secondary border border-border rounded-lg p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-sm text-neutral">Processing your unsubscribe request...</p>
        </div>
      </div>
    );
  }

  if (!unsubscribeStatus) {
    return (
      <div className="bg-secondary border border-red-500/20 rounded-lg p-6">
        <div className="text-center">
          <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
        </div>
      </div>
    );
  }

  if (!unsubscribeStatus.success) {
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
            Unsubscribe Failed
          </h3>
          <p className="text-sm text-neutral mb-4">
            {unsubscribeStatus.message}
          </p>
          <Link
            href="/#contact"
            className="text-accent hover:text-accent/80 underline text-sm"
          >
            Contact us for help
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary border border-accent/20 rounded-lg p-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-accent/10 mb-4">
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
        </div>
        <h3 className="text-lg font-medium text-secondary-content mb-2">
          ✅ Successfully Unsubscribed
        </h3>
        <p className="text-sm text-neutral mb-6">
          {unsubscribeStatus.message}
        </p>

        <div className="bg-primary/50 border border-border rounded-md p-4 mb-6">
          <h4 className="text-sm font-medium text-primary-content mb-2">
            We're sorry to see you go! 😢
          </h4>
          <p className="text-xs text-neutral">
            If you change your mind, you can always subscribe again from our homepage.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/newsletter/subscribe"
            className="block w-full bg-accent text-primary py-2 px-4 rounded-md text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            🔄 Subscribe Again
          </Link>
          <Link
            href="/#contact"
            className="block text-accent hover:text-accent/80 underline text-sm"
          >
            💬 Give Us Feedback
          </Link>
          <Link
            href="/"
            className="block text-accent hover:text-accent/80 underline text-sm"
          >
            🏠 Back to Homepage
          </Link>
        </div>

        <p className="text-xs text-neutral mt-4">
          Redirecting to homepage in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default NewsletterUnsubscribe;