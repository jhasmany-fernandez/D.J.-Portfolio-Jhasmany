import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Jhasmany Fernandez',
  description: 'Welcome to your personal dashboard.',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral mb-2">Dashboard Overview</h1>
        <p className="text-tertiary-content">Bienvenido al panel de administración</p>
      </div>
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-secondary border-border rounded-lg border p-6">
          <div className="flex items-center">
            <div className="text-accent text-2xl mr-3">📊</div>
            <div>
              <p className="text-sm text-tertiary-content">Total Views</p>
              <p className="text-2xl font-bold text-neutral">24,856</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary border-border rounded-lg border p-6">
          <div className="flex items-center">
            <div className="text-accent text-2xl mr-3">🚀</div>
            <div>
              <p className="text-sm text-tertiary-content">Projects</p>
              <p className="text-2xl font-bold text-neutral">12</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary border-border rounded-lg border p-6">
          <div className="flex items-center">
            <div className="text-accent text-2xl mr-3">👥</div>
            <div>
              <p className="text-sm text-tertiary-content">Users</p>
              <p className="text-2xl font-bold text-neutral">1,248</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary border-border rounded-lg border p-6">
          <div className="flex items-center">
            <div className="text-accent text-2xl mr-3">⭐</div>
            <div>
              <p className="text-sm text-tertiary-content">Rating</p>
              <p className="text-2xl font-bold text-neutral">4.9</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-secondary border-border rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-neutral mb-4">Acciones Rápidas</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/dashboard/projects"
            className="bg-primary hover:bg-primary/80 border-border border rounded-lg p-4 transition-colors duration-200 group"
          >
            <div className="text-accent text-2xl mb-2">📁</div>
            <h4 className="font-medium text-primary-content group-hover:text-accent">Gestionar Proyectos</h4>
            <p className="text-sm text-tertiary-content">Agregar o editar proyectos del portfolio</p>
          </Link>

          <Link
            href="/dashboard/analytics"
            className="bg-primary hover:bg-primary/80 border-border border rounded-lg p-4 transition-colors duration-200 group"
          >
            <div className="text-accent text-2xl mb-2">📈</div>
            <h4 className="font-medium text-primary-content group-hover:text-accent">Ver Analíticas</h4>
            <p className="text-sm text-tertiary-content">Revisar estadísticas de visitantes</p>
          </Link>

          <Link
            href="/dashboard/settings"
            className="bg-primary hover:bg-primary/80 border-border border rounded-lg p-4 transition-colors duration-200 group"
          >
            <div className="text-accent text-2xl mb-2">⚙️</div>
            <h4 className="font-medium text-primary-content group-hover:text-accent">Configuración</h4>
            <p className="text-sm text-tertiary-content">Ajustar preferencias del sistema</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-secondary border-border rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-neutral mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-primary/50 rounded-lg">
            <div className="text-accent">📝</div>
            <div>
              <p className="text-sm text-primary-content">Nuevo proyecto agregado: "E-commerce Platform"</p>
              <p className="text-xs text-tertiary-content">Hace 2 horas</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-primary/50 rounded-lg">
            <div className="text-accent">👤</div>
            <div>
              <p className="text-sm text-primary-content">Usuario nuevo registrado</p>
              <p className="text-xs text-tertiary-content">Hace 4 horas</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-primary/50 rounded-lg">
            <div className="text-accent">🔧</div>
            <div>
              <p className="text-sm text-primary-content">Configuración actualizada</p>
              <p className="text-xs text-tertiary-content">Hace 1 día</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}