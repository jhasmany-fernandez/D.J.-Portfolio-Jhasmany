'use client'

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-lg rounded-lg border border-border bg-secondary p-6">
            <h1 className="text-xl font-semibold text-neutral">Error global</h1>
            <p className="mt-2 text-sm text-tertiary-content">
              Se produjo un error critico en la aplicacion.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-4 rounded-lg bg-accent px-4 py-2 text-secondary"
            >
              Reintentar
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
