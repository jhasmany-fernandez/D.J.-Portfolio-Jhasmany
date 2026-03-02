import { Metadata } from 'next';
import { Suspense } from 'react';
import NewsletterUnsubscribe from '@/components/Newsletter/NewsletterUnsubscribe';

export const metadata: Metadata = {
  title: 'Unsubscribe from Newsletter | Portfolio Jhasmany',
  description: 'Unsubscribe from our newsletter.',
};

export default function NewsletterUnsubscribePage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-primary-content">
            👋 Unsubscribe
          </h2>
          <p className="mt-2 text-center text-sm text-neutral">
            We're sorry to see you go...
          </p>
        </div>
        <Suspense fallback={<div className="text-center text-neutral">Loading...</div>}>
          <NewsletterUnsubscribe />
        </Suspense>
      </div>
    </div>
  );
}