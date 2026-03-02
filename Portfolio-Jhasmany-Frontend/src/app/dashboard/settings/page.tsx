import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings | Dashboard - Jhasmany Fernandez',
  description: 'Configure your dashboard settings and preferences.',
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral mb-2">Settings</h1>
        <p className="text-tertiary-content">Configura las preferencias de tu dashboard</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-secondary border-border rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-neutral mb-4">Perfil de Usuario</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-primary-content mb-2">Nombre Completo</label>
            <input
              type="text"
              defaultValue="Jhasmany Fernandez"
              className="w-full bg-primary border border-border rounded-lg px-3 py-2 text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-content mb-2">Email</label>
            <input
              type="email"
              defaultValue="jhasmany.fernandez.dev@gmail.com"
              className="w-full bg-primary border border-border rounded-lg px-3 py-2 text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-content mb-2">Rol</label>
            <select className="w-full bg-primary border border-border rounded-lg px-3 py-2 text-primary-content focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="admin">Administrador</option>
              <option value="editor">Editor</option>
              <option value="viewer">Visualizador</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-content mb-2">Zona Horaria</label>
            <select className="w-full bg-primary border border-border rounded-lg px-3 py-2 text-primary-content focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="America/Lima">Lima (UTC-5)</option>
              <option value="America/New_York">New York (UTC-5)</option>
              <option value="Europe/Madrid">Madrid (UTC+1)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-secondary border-border rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-neutral mb-4">Notificaciones</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-primary-content font-medium">Notificaciones por Email</h4>
              <p className="text-tertiary-content text-sm">Recibe notificaciones importantes por correo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-primary-content font-medium">Notificaciones Push</h4>
              <p className="text-tertiary-content text-sm">Recibe notificaciones en tiempo real</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-primary-content font-medium">Reportes Semanales</h4>
              <p className="text-tertiary-content text-sm">Recibe un resumen semanal de actividad</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-secondary border-border rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-neutral mb-4">Configuración del Sistema</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-primary-content mb-2">Idioma</label>
            <select className="w-full bg-primary border border-border rounded-lg px-3 py-2 text-primary-content focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-content mb-2">Tema</label>
            <select className="w-full bg-primary border border-border rounded-lg px-3 py-2 text-primary-content focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="dark">Oscuro</option>
              <option value="light">Claro</option>
              <option value="auto">Automático</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-secondary border-border rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-neutral mb-4">Seguridad</h3>
        <div className="space-y-4">
          <button className="bg-accent hover:bg-accent/80 text-secondary px-4 py-2 rounded-lg transition-colors duration-200">
            Cambiar Contraseña
          </button>
          <button className="bg-secondary hover:bg-secondary/80 text-primary-content border border-border px-4 py-2 rounded-lg transition-colors duration-200">
            Configurar 2FA
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            Cerrar Todas las Sesiones
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-4">
        <button className="bg-accent hover:bg-accent/80 text-secondary px-6 py-2 rounded-lg transition-colors duration-200">
          Guardar Cambios
        </button>
        <button className="bg-secondary hover:bg-secondary/80 text-primary-content border border-border px-6 py-2 rounded-lg transition-colors duration-200">
          Cancelar
        </button>
      </div>
    </div>
  )
}