'use client'

import { useEffect } from 'react'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Unhandled app error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-lg border border-border bg-secondary p-6">
        <h1 className="text-xl font-semibold text-neutral">Algo salio mal</h1>
        <p className="mt-2 text-sm text-tertiary-content">
          Ocurrio un error inesperado al cargar esta pagina.
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
  )
}
