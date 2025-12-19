'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'

interface FooterData {
  id: string
  companyName: string
  description: string
  email: string
  phone: string
  locationLine1: string
  locationLine2: string
  isActive: boolean
}

export default function FooterPage() {
  const toast = useToast()
  const [footerData, setFooterData] = useState<FooterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<FooterData>>({
    companyName: '',
    description: '',
    email: '',
    phone: '',
    locationLine1: '',
    locationLine2: '',
  })

  // Fetch footer data
  const fetchFooterData = async () => {
    try {
      const response = await fetch('/api/footer')
      if (response.ok) {
        const data = await response.json()
        setFooterData(data)
        setFormData({
          companyName: data.companyName,
          description: data.description,
          email: data.email,
          phone: data.phone,
          locationLine1: data.locationLine1,
          locationLine2: data.locationLine2,
        })
      } else {
        toast.error('Error al cargar configuración del footer')
      }
    } catch (error) {
      console.error('Error fetching footer data:', error)
      toast.error('Error al cargar configuración del footer')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFooterData()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!footerData) return

    setSaving(true)
    try {
      const response = await fetch(`/api/footer/${footerData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Footer actualizado exitosamente')
        fetchFooterData()
      } else {
        toast.error('Error al actualizar el footer')
      }
    } catch (error) {
      console.error('Error updating footer:', error)
      toast.error('Error al actualizar el footer')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-primary-content">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-content mb-2">
          Footer Configuration
        </h1>
        <p className="text-tertiary-content">
          Configura la información que aparece en el footer de tu portfolio
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Name */}
        <div className="bg-secondary border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-primary-content mb-4">
            Información General
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-content mb-2">
                Nombre / Marca *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Ej: Jhasmany Fernández"
                required
              />
              <p className="text-xs text-tertiary-content mt-1">
                Tu nombre o nombre de tu marca personal
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-content mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Ej: Full-Stack Developer especializado en tecnologías modernas..."
                required
              />
              <p className="text-xs text-tertiary-content mt-1">
                Breve descripción sobre ti o tu trabajo
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-secondary border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-primary-content mb-4">
            Información de Contacto
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-content mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-content mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="+591 12345678"
                required
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-secondary border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-primary-content mb-4">
            Ubicación
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-content mb-2">
                Ubicación - Línea 1 *
              </label>
              <input
                type="text"
                value={formData.locationLine1}
                onChange={(e) =>
                  setFormData({ ...formData, locationLine1: e.target.value })
                }
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Ej: Santa Cruz de la Sierra"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-content mb-2">
                Ubicación - Línea 2 *
              </label>
              <input
                type="text"
                value={formData.locationLine2}
                onChange={(e) =>
                  setFormData({ ...formData, locationLine2: e.target.value })
                }
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Ej: Bolivia"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button
            type="button"
            onClick={() => fetchFooterData()}
            className="px-6 py-3 bg-secondary border border-border text-primary-content rounded-lg hover:bg-primary transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
      <toast.ToastContainer />
    </div>
  )
}
