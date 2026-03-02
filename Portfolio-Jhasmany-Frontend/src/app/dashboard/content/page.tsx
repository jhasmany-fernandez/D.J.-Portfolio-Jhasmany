import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content | Dashboard - Jhasmany Fernandez',
  description: 'Manage your content and media files.',
}

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral mb-2">Content Management</h1>
        <p className="text-tertiary-content">Gestiona el contenido de tu portfolio</p>
      </div>

      <div className="bg-secondary border-border rounded-lg border p-12 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-neutral mb-2">Content Manager</h3>
        <p className="text-tertiary-content mb-6">
          Aquí podrás gestionar todas las páginas, artículos y contenido multimedia de tu portfolio.
        </p>
        <button className="bg-accent hover:bg-accent/80 text-secondary px-6 py-2 rounded-lg transition-colors duration-200">
          Próximamente
        </button>
      </div>
    </div>
  )
}