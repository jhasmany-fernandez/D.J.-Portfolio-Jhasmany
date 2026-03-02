import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analytics | Dashboard - Jhasmany Fernandez',
  description: 'View your portfolio analytics and statistics.',
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral mb-2">Analytics Dashboard</h1>
        <p className="text-tertiary-content">Monitorea el rendimiento de tu portfolio</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-secondary border-border rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-tertiary-content">Visitantes</p>
              <p className="text-3xl font-bold text-neutral">24,856</p>
              <p className="text-sm text-accent">+12% vs mes anterior</p>
            </div>
            <div className="text-accent text-3xl">👥</div>
          </div>
        </div>

        <div className="bg-secondary border-border rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-tertiary-content">Páginas Vistas</p>
              <p className="text-3xl font-bold text-neutral">48,392</p>
              <p className="text-sm text-accent">+8% vs mes anterior</p>
            </div>
            <div className="text-accent text-3xl">📄</div>
          </div>
        </div>

        <div className="bg-secondary border-border rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-tertiary-content">Tiempo Promedio</p>
              <p className="text-3xl font-bold text-neutral">3:42</p>
              <p className="text-sm text-accent">+5% vs mes anterior</p>
            </div>
            <div className="text-accent text-3xl">⏱️</div>
          </div>
        </div>

        <div className="bg-secondary border-border rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-tertiary-content">Tasa Rebote</p>
              <p className="text-3xl font-bold text-neutral">32%</p>
              <p className="text-sm text-accent">-3% vs mes anterior</p>
            </div>
            <div className="text-accent text-3xl">📊</div>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-secondary border-border rounded-lg border p-6">
          <h3 className="text-xl font-semibold text-neutral mb-4">Tráfico por Dispositivo</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-primary-content">Desktop</span>
              <div className="flex items-center gap-2">
                <div className="bg-accent/20 rounded-full h-2 w-32">
                  <div className="bg-accent h-2 rounded-full w-20"></div>
                </div>
                <span className="text-tertiary-content text-sm">62%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-primary-content">Mobile</span>
              <div className="flex items-center gap-2">
                <div className="bg-accent/20 rounded-full h-2 w-32">
                  <div className="bg-accent h-2 rounded-full w-12"></div>
                </div>
                <span className="text-tertiary-content text-sm">35%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-primary-content">Tablet</span>
              <div className="flex items-center gap-2">
                <div className="bg-accent/20 rounded-full h-2 w-32">
                  <div className="bg-accent h-2 rounded-full w-1"></div>
                </div>
                <span className="text-tertiary-content text-sm">3%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary border-border rounded-lg border p-6">
          <h3 className="text-xl font-semibold text-neutral mb-4">Páginas Más Visitadas</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary/30 rounded-lg">
              <span className="text-primary-content">/</span>
              <span className="text-accent font-semibold">15,432 vistas</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary/30 rounded-lg">
              <span className="text-primary-content">/#projects</span>
              <span className="text-accent font-semibold">8,921 vistas</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary/30 rounded-lg">
              <span className="text-primary-content">/#contact</span>
              <span className="text-accent font-semibold">5,673 vistas</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary/30 rounded-lg">
              <span className="text-primary-content">/#services</span>
              <span className="text-accent font-semibold">3,124 vistas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-secondary border-border rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-neutral mb-4">Fuentes de Tráfico</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-primary/30 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🔍</div>
            <div className="text-lg font-semibold text-neutral">45%</div>
            <div className="text-sm text-tertiary-content">Búsqueda Orgánica</div>
          </div>
          <div className="bg-primary/30 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🔗</div>
            <div className="text-lg font-semibold text-neutral">28%</div>
            <div className="text-sm text-tertiary-content">Tráfico Directo</div>
          </div>
          <div className="bg-primary/30 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">📱</div>
            <div className="text-lg font-semibold text-neutral">27%</div>
            <div className="text-sm text-tertiary-content">Redes Sociales</div>
          </div>
        </div>
      </div>
    </div>
  )
}