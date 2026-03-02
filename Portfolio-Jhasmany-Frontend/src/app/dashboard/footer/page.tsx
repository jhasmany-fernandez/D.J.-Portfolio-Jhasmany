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
  githubUrl?: string
  linkedinUrl?: string
  codepenUrl?: string
  twitterUrl?: string
  instagramUrl?: string
  facebookUrl?: string
  availableLanguages?: string[]
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
    githubUrl: '',
    linkedinUrl: '',
    codepenUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    facebookUrl: '',
    availableLanguages: ['en', 'es'],
  })

  // Fetch footer data
  const fetchFooterData = async () => {
    try {
      const response = await fetch('/api/footer')
      if (response.ok) {
        const data = await response.json()
        // Parse availableLanguages if it's a string (from database)
        const languages = typeof data.availableLanguages === 'string'
          ? data.availableLanguages.split(',').filter((l: string) => l.trim())
          : (Array.isArray(data.availableLanguages) ? data.availableLanguages : ['en', 'es'])

        setFooterData({ ...data, availableLanguages: languages })
        setFormData({
          companyName: data.companyName,
          description: data.description,
          email: data.email,
          phone: data.phone,
          locationLine1: data.locationLine1,
          locationLine2: data.locationLine2,
          githubUrl: data.githubUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          codepenUrl: data.codepenUrl || '',
          twitterUrl: data.twitterUrl || '',
          instagramUrl: data.instagramUrl || '',
          facebookUrl: data.facebookUrl || '',
          availableLanguages: languages,
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

        {/* Social Media Links */}
        <div className="bg-secondary border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-primary-content mb-4">
            Redes Sociales
          </h2>
          <p className="text-sm text-tertiary-content mb-4">
            Configura los enlaces a tus redes sociales. Los iconos solo aparecerán si ingresas una URL.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-content mb-2">
                GitHub
              </label>
              <input
                type="url"
                value={formData.githubUrl || ''}
                onChange={(e) =>
                  setFormData({ ...formData, githubUrl: e.target.value })
                }
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://github.com/tu-usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-content mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedinUrl || ''}
                onChange={(e) =>
                  setFormData({ ...formData, linkedinUrl: e.target.value })
                }
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://linkedin.com/in/tu-perfil"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-content mb-2">
                CodePen
              </label>
              <input
                type="url"
                value={formData.codepenUrl || ''}
                onChange={(e) =>
                  setFormData({ ...formData, codepenUrl: e.target.value })
                }
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://codepen.io/tu-usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-content mb-2">
                Twitter / X
              </label>
              <input
                type="url"
                value={formData.twitterUrl || ''}
                onChange={(e) =>
                  setFormData({ ...formData, twitterUrl: e.target.value })
                }
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://twitter.com/tu-usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-content mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={formData.instagramUrl || ''}
                onChange={(e) =>
                  setFormData({ ...formData, instagramUrl: e.target.value })
                }
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://instagram.com/tu-usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-content mb-2">
                Facebook
              </label>
              <input
                type="url"
                value={formData.facebookUrl || ''}
                onChange={(e) =>
                  setFormData({ ...formData, facebookUrl: e.target.value })
                }
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="https://facebook.com/tu-perfil"
              />
            </div>
          </div>
        </div>

        {/* Available Languages */}
        <div className="bg-secondary border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-primary-content mb-4">
            Idiomas Disponibles
          </h2>
          <p className="text-sm text-tertiary-content mb-4">
            Selecciona los idiomas que estarán disponibles en tu portfolio
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['en', 'es', 'fr', 'de', 'ru'].map((lang) => {
              const langNames: Record<string, string> = {
                en: 'English (EN)',
                es: 'Español (ES)',
                fr: 'Français (FR)',
                de: 'Deutsch (DE)',
                ru: 'Русский (RU)',
              }
              const isSelected = formData.availableLanguages?.includes(lang) || false

              return (
                <div key={lang} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`lang-${lang}`}
                    checked={isSelected}
                    onChange={(e) => {
                      const currentLangs = formData.availableLanguages || []
                      const newLangs = e.target.checked
                        ? [...currentLangs, lang]
                        : currentLangs.filter(l => l !== lang)
                      setFormData({ ...formData, availableLanguages: newLangs })
                    }}
                    className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2"
                  />
                  <label
                    htmlFor={`lang-${lang}`}
                    className="ml-2 text-sm text-primary-content cursor-pointer"
                  >
                    {langNames[lang]}
                  </label>
                </div>
              )
            })}
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
