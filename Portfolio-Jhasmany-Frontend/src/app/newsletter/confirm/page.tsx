import { Metadata } from 'next';
import { Suspense } from 'react';
import NewsletterConfirmation from '@/components/Newsletter/NewsletterConfirmation';

export const metadata: Metadata = {
  title: 'Confirm Newsletter Subscription | Portfolio Jhasmany',
  description: 'Confirm your newsletter subscription to receive our portfolio catalog.',
};

export default function NewsletterConfirmPage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-primary-content">
            ✅ Confirm Your Subscription
          </h2>
          <p className="mt-2 text-center text-sm text-neutral">
            Please wait while we confirm your newsletter subscription...
          </p>
        </div>
        <Suspense fallback={<div className="text-center text-neutral">Loading...</div>}>
          <NewsletterConfirmation />
        </Suspense>
      </div>
    </div>
  );
}