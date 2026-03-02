'use client'

import { useState } from 'react';
import { useActionState } from 'react';
import Link from 'next/link';
import { subscribeNewsletterAction } from '@/actions/newsletter';

const NewsletterSubscribeForm = () => {
  const [status, formAction, isPending] = useActionState(subscribeNewsletterAction, null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    formData.append('source', 'subscribe-page');
    setIsSubmitted(true);
    await formAction(formData);
  };

  if (isSubmitted && status?.success) {
    const isAlreadySubscribed = status?.alreadySubscribed;

    return (
      <div className={`border rounded-lg p-6 ${
        isAlreadySubscribed
          ? 'bg-secondary border-neutral/20'
          : 'bg-secondary border-accent/20'
      }`}>
        <div className="text-center">
          <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
            isAlreadySubscribed
              ? 'bg-neutral/10'
              : 'bg-accent/10'
          }`}>
            <svg
              className={`h-8 w-8 ${
                isAlreadySubscribed
                  ? 'text-neutral'
                  : 'text-accent'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isAlreadySubscribed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              )}
            </svg>
          </div>
          <h3 className="text-lg font-medium text-secondary-content mb-2">
            {isAlreadySubscribed ? '✅ ¡Ya te encontrabas suscrito!' : '🎉 Almost There!'}
          </h3>
          <p className="text-sm text-neutral mb-4">
            {status.message}
          </p>
          {!isAlreadySubscribed && (
            <div className="text-xs text-neutral">
              Check your email inbox (and spam folder) for the confirmation link.
            </div>
          )}
          {!isAlreadySubscribed && (
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-accent hover:text-accent/80 transition-colors"
              >
                ← Volver al portafolio
              </Link>
            </div>
          )}
          {isAlreadySubscribed && (
            <div className="text-xs text-neutral">
              You're all set! You'll continue receiving our portfolio updates and developer insights.
            </div>
          )}
          {isAlreadySubscribed && (
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-accent hover:text-accent/80 transition-colors"
              >
                ← Volver al portafolio
              </Link>
            </div>
          )}
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
              Email address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-primary border border-border rounded-md text-primary-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-secondary-content">
                First Name *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                className="mt-1 block w-full px-3 py-2 bg-primary border border-border rounded-md text-primary-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="John"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-secondary-content">
                Last Name *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                className="mt-1 block w-full px-3 py-2 bg-primary border border-border rounded-md text-primary-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-secondary-content">
              Company (Optional)
            </label>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              className="mt-1 block w-full px-3 py-2 bg-primary border border-border rounded-md text-primary-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Your Company"
            />
          </div>

          <div className="bg-primary/50 border border-border rounded-md p-4">
            <h4 className="text-sm font-medium text-primary-content mb-2">📋 What you'll receive:</h4>
            <ul className="text-xs text-neutral space-y-1">
              <li>• 📁 Complete portfolio catalog with latest projects</li>
              <li>• ⚡ Services catalog and pricing information</li>
              <li>• 💡 Developer insights and technical tips</li>
              <li>• 🚀 Early access to new projects and updates</li>
            </ul>
          </div>

          {status?.error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3">
              <p className="text-sm text-red-400">{status.error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subscribing...
              </div>
            ) : (
              '📧 Subscribe to Newsletter'
            )}
          </button>

          <p className="text-xs text-neutral text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="text-sm text-accent hover:text-accent/80 transition-colors"
        >
          ← Back to Homepage
        </Link>
      </div>
    </form>
  );
};

export default NewsletterSubscribeForm;