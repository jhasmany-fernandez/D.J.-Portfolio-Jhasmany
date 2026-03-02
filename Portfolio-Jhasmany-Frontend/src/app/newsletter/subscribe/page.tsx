import { Metadata } from 'next';
import NewsletterSubscribeForm from '@/components/Newsletter/NewsletterSubscribeForm';

export const metadata: Metadata = {
  title: 'Subscribe to Newsletter | Portfolio Jhasmany',
  description: 'Subscribe to receive our portfolio catalog, latest projects, and developer insights.',
};

export default function NewsletterSubscribePage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-primary-content">
            📧 Subscribe to Our Newsletter
          </h2>
          <p className="mt-2 text-center text-sm text-neutral">
            Get our portfolio catalog, latest projects, and exclusive developer insights delivered to your inbox.
          </p>
        </div>
        <NewsletterSubscribeForm />
      </div>
    </div>
  );
}