'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'

interface Service {
  id: string
  title: string
  shortDescription: string
  icon: string
  imageUrl?: string
  technologies?: string[]
  experienceLevel?: string
  demoUrl?: string
  githubUrl?: string
  clientsServed?: string
  projectsCompleted?: string
  ratings?: string
  showDemoInPortfolio?: boolean
  showGithubInPortfolio?: boolean
  showClientsServedInPortfolio?: boolean
  showProjectsCompletedInPortfolio?: boolean
  showRatingsInPortfolio?: boolean
  order: number
  isPublished: boolean
  createdAt?: string
  updatedAt?: string
}

export default function ServicesPage() {
  const toast = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [sectionData, setSectionData] = useState<{ id: string; subtitle: string } | null>(null)
  const [editingSection, setEditingSection] = useState(false)
  const [sectionSubtitle, setSectionSubtitle] = useState('')
  const [createForm, setCreateForm] = useState<Partial<Service>>({
    title: '',
    shortDescription: '',
    icon: '',
    technologies: [],
    experienceLevel: '',
    demoUrl: '',
    githubUrl: '',
    clientsServed: '',
    projectsCompleted: '',
    ratings: '',
    showDemoInPortfolio: true,
    showGithubInPortfolio: true,
    showClientsServedInPortfolio: true,
    showProjectsCompletedInPortfolio: true,
    showRatingsInPortfolio: true,
    order: 1,
    isPublished: true
  })
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editForm, setEditForm] = useState<Service | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [techInput, setTechInput] = useState('')

  // Fetch services
  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setServices(data.services || [])
      setError(null)
    } catch (error) {
      console.error('Error fetching services:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  // Delete service
  const deleteService = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) return

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchServices()
        toast.success('Servicio eliminado exitosamente')
      } else {
        toast.error('Error al eliminar el servicio')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('Error al eliminar el servicio')
    }
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Add technology to create form
  const addTechnology = (tech: string, isEdit: boolean = false) => {
    if (!tech.trim()) return

    if (isEdit && editForm) {
      const currentTechs = editForm.technologies || []
      if (!currentTechs.includes(tech.trim())) {
        setEditForm({
          ...editForm,
          technologies: [...currentTechs, tech.trim()]
        })
      }
    } else {
      const currentTechs = createForm.technologies || []
      if (!currentTechs.includes(tech.trim())) {
        setCreateForm({
          ...createForm,
          technologies: [...currentTechs, tech.trim()]
        })
      }
    }
    setTechInput('')
  }

  // Remove technology
  const removeTechnology = (tech: string, isEdit: boolean = false) => {
    if (isEdit && editForm) {
      setEditForm({
        ...editForm,
        technologies: (editForm.technologies || []).filter(t => t !== tech)
      })
    } else {
      setCreateForm({
        ...createForm,
        technologies: (createForm.technologies || []).filter(t => t !== tech)
      })
    }
  }

  // Upload image to backend via Next.js API proxy
  const uploadImage = async () => {
    if (!selectedFile) return null

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      // Use Next.js API route as proxy to avoid CORS issues
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Imagen subida exitosamente')
        return result.url
      } else {
        const errorData = await response.json()
        console.error('Upload error:', errorData)
        toast.error('Error al subir la imagen')
        return null
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Error al subir la imagen')
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  // Start editing service
  const startEditing = (service: Service) => {
    setEditingService(service)
    setEditForm({ ...service })
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingService(null)
    setEditForm(null)
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  // Update form field
  const updateFormField = (field: keyof Service, value: string | number | boolean) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        [field]: value
      })
    }
  }

  // Update create form field
  const updateCreateFormField = (field: string, value: string | number | boolean) => {
    setCreateForm({
      ...createForm,
      [field]: value
    })
  }

  // Reset create form
  const resetCreateForm = () => {
    setCreateForm({
      title: '',
      shortDescription: '',
      icon: '',
      technologies: [],
      experienceLevel: '',
      order: 1,
      isPublished: true
    })
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  // Create new service
  const createService = async () => {
    setSaving(true)
    try {
      let imageUrl = ''

      // Upload image first if a file was selected
      if (selectedFile) {
        imageUrl = await uploadImage()
        if (!imageUrl) {
          toast.error('Error al subir la imagen. Por favor, intenta de nuevo.')
          setSaving(false)
          return
        }
      }

      // Prepare service data
      const serviceData = {
        ...createForm,
        imageUrl: imageUrl || createForm.imageUrl || ''
      }

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceData)
      })

      if (response.ok) {
        await fetchServices()
        setShowCreateForm(false)
        resetCreateForm()
        toast.success('Servicio creado exitosamente')
      } else {
        toast.error('Error al crear el servicio')
      }
    } catch (error) {
      console.error('Error creating service:', error)
      toast.error('Error al crear el servicio')
    } finally {
      setSaving(false)
    }
  }

  // Save service changes
  const saveService = async () => {
    if (!editForm || !editingService) return

    setSaving(true)
    try {
      // Upload image first if a file was selected
      if (selectedFile) {
        const imageUrl = await uploadImage()
        if (imageUrl) {
          editForm.imageUrl = imageUrl
        } else {
          toast.error('Error al subir la imagen. Por favor, intenta de nuevo.')
          setSaving(false)
          return
        }
      }

      const { id, createdAt, updatedAt, authorId, author, ...updateData } = editForm as any

      const response = await fetch(`/api/services/${editingService.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        await fetchServices()
        cancelEditing()
        toast.success('Servicio actualizado exitosamente')
      } else {
        toast.error('Error al actualizar el servicio')
      }
    } catch (error) {
      console.error('Error updating service:', error)
      toast.error('Error al actualizar el servicio')
    } finally {
      setSaving(false)
    }
  }

  // Toggle published status
  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isPublished: !currentStatus })
      })

      if (response.ok) {
        await fetchServices()
        toast.success(`Servicio ${!currentStatus ? 'publicado' : 'despublicado'} exitosamente`)
      } else {
        toast.error('Error al cambiar el estado de publicación')
      }
    } catch (error) {
      console.error('Error toggling published status:', error)
      toast.error('Error al cambiar el estado de publicación')
    }
  }

  // Fetch section data
  const fetchSectionData = async () => {
    try {
      const response = await fetch('/api/services-section')
      if (response.ok) {
        const data = await response.json()
        setSectionData(data)
        setSectionSubtitle(data.subtitle)
      }
    } catch (error) {
      console.error('Error fetching section data:', error)
    }
  }

  // Update section data
  const updateSectionData = async () => {
    if (!sectionData) return

    try {
      const response = await fetch(`/api/services-section/${sectionData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtitle: sectionSubtitle }),
      })

      if (response.ok) {
        toast.success('Subtítulo actualizado exitosamente')
        setEditingSection(false)
        fetchSectionData()
      } else {
        toast.error('Error al actualizar el subtítulo')
      }
    } catch (error) {
      console.error('Error updating section data:', error)
      toast.error('Error al actualizar el subtítulo')
    }
  }

  useEffect(() => {
    fetchServices()
    fetchSectionData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral mb-2">Services Management</h1>
          <p className="text-tertiary-content">Cargando servicios...</p>
        </div>
        <div className="flex justify-center py-12">
          <div className="text-accent text-2xl">⏳ Cargando...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral mb-2">Services Management</h1>
          <p className="text-tertiary-content">Error al cargar servicios</p>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
        <button
          onClick={fetchServices}
          className="bg-accent hover:bg-accent/80 text-secondary px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral mb-2">Services Management</h1>
        <p className="text-tertiary-content">Gestiona todos los servicios de tu portfolio</p>
      </div>

      {/* Section Subtitle Editor */}
      {sectionData && (
        <div className="bg-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-neutral mb-1">Subtítulo de la Sección</h2>
              <p className="text-sm text-tertiary-content">
                Este texto aparece debajo del título "// Services / Offers:" en la página principal
              </p>
            </div>
            {!editingSection && (
              <button
                onClick={() => setEditingSection(true)}
                className="bg-accent hover:bg-accent/80 text-secondary px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Editar
              </button>
            )}
          </div>

          {editingSection ? (
            <div className="space-y-4">
              <textarea
                value={sectionSubtitle}
                onChange={(e) => setSectionSubtitle(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                rows={3}
                placeholder="Escribe el subtítulo de la sección..."
              />
              <div className="flex gap-2">
                <button
                  onClick={updateSectionData}
                  className="bg-accent hover:bg-accent/80 text-secondary px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setSectionSubtitle(sectionData.subtitle)
                    setEditingSection(false)
                  }}
                  className="bg-secondary border border-border hover:bg-primary text-neutral px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="text-neutral bg-primary border border-border rounded-lg p-4">
              {sectionData.subtitle}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-accent hover:bg-accent/80 text-secondary px-4 py-2 rounded-lg transition-colors duration-200"
        >
          + Nuevo Servicio
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service.id} className="bg-secondary border-border rounded-lg border p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">
                {service.icon || '🔧'}
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-accent/20 text-accent px-2 py-1 rounded-full text-xs">
                  Orden {service.order}
                </span>
                <button
                  onClick={() => togglePublished(service.id, service.isPublished)}
                  className={`px-2 py-1 rounded-full text-xs transition-colors duration-200 ${
                    service.isPublished
                      ? 'bg-green-500/20 text-green-700 hover:bg-green-500/30'
                      : 'bg-gray-500/20 text-gray-700 hover:bg-gray-500/30'
                  }`}
                  title={service.isPublished ? 'Publicado - Click para despublicar' : 'Despublicado - Click para publicar'}
                >
                  {service.isPublished ? '✓ Publicado' : '✗ Privado'}
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-neutral mb-2 truncate" title={service.title}>
              {service.title}
            </h3>
            <p className="text-tertiary-content text-sm mb-4 line-clamp-3">
              {service.shortDescription}
            </p>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => startEditing(service)}
                className="bg-accent hover:bg-accent/80 text-secondary px-3 py-1 rounded text-sm transition-colors duration-200"
              >
                Editar
              </button>
              <button
                onClick={() => deleteService(service.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="bg-secondary border-border rounded-lg border p-12 text-center">
          <div className="text-6xl mb-4">🔧</div>
          <h3 className="text-xl font-semibold text-neutral mb-2">No hay servicios</h3>
          <p className="text-tertiary-content mb-6">
            Comienza creando tu primer servicio para mostrarlo en tu portfolio.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-accent hover:bg-accent/80 text-secondary px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Crear Primer Servicio
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="bg-secondary border-border rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-neutral mb-4">Estadísticas de Servicios</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{services.length}</div>
            <div className="text-sm text-tertiary-content">Total Servicios</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {services.filter(s => s.isPublished).length}
            </div>
            <div className="text-sm text-tertiary-content">Publicados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {services.filter(s => !s.isPublished).length}
            </div>
            <div className="text-sm text-tertiary-content">Privados</div>
          </div>
        </div>
      </div>

      {/* Create Service Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-secondary border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-neutral mb-4">Crear Nuevo Servicio</h3>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); createService(); }}>
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Título del Servicio *
                </label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => updateCreateFormField('title', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Descripción Corta *
                </label>
                <textarea
                  value={createForm.shortDescription ?? ''}
                  onChange={(e) => updateCreateFormField('shortDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Orden *
                </label>
                <input
                  type="number"
                  value={createForm.order || 1}
                  onChange={(e) => updateCreateFormField('order', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">
                  Imagen del Servicio (opcional)
                </label>
                <div className="mb-3">
                  <label className="block text-sm text-tertiary-content mb-2">
                    Subir imagen:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-secondary hover:file:bg-accent/80"
                  />
                  {previewUrl && (
                    <div className="mt-3">
                      <img
                        src={previewUrl}
                        alt="Vista previa"
                        className="max-w-xs max-h-48 rounded-lg border border-border"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-tertiary-content">
                  La imagen se mostrará junto al emoji en la tarjeta del servicio
                </p>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">
                  Tecnologías / Herramientas
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTechnology(techInput)
                      }
                    }}
                    placeholder="ej: React, Node.js, Docker"
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="button"
                    onClick={() => addTechnology(techInput)}
                    className="bg-accent hover:bg-accent/80 text-secondary px-4 py-2 rounded-lg transition-colors"
                  >
                    Agregar
                  </button>
                </div>
                {createForm.technologies && createForm.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {createForm.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-primary text-primary-content px-3 py-1 rounded-lg text-sm flex items-center gap-2 border border-border"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-tertiary-content mt-2">
                  Presiona Enter o click en "Agregar" para añadir cada tecnología
                </p>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Nivel de Experiencia
                </label>
                <input
                  type="text"
                  value={createForm.experienceLevel || ''}
                  onChange={(e) => updateCreateFormField('experienceLevel', e.target.value)}
                  placeholder="ej: 5+ años, Experto, Intermedio"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <p className="text-xs text-tertiary-content mt-1">
                  Este badge se mostrará en la esquina superior de la tarjeta
                </p>
              </div>

              {/* URLs Section */}
              <div className="bg-primary border border-border rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-neutral mb-3">Enlaces y URLs</h4>

                {/* Demo URL */}
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    URL de Vista Previa
                  </label>
                  <input
                    type="url"
                    value={createForm.demoUrl || ''}
                    onChange={(e) => updateCreateFormField('demoUrl', e.target.value)}
                    placeholder="https://ejemplo.com/demo"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="createShowDemo"
                      checked={createForm.showDemoInPortfolio || false}
                      onChange={(e) => updateCreateFormField('showDemoInPortfolio', e.target.checked)}
                      className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent"
                    />
                    <label htmlFor="createShowDemo" className="text-xs text-tertiary-content">
                      Mostrar enlace de Vista Previa en el portfolio público
                    </label>
                  </div>
                </div>

                {/* GitHub URL */}
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    URL de GitHub
                  </label>
                  <input
                    type="url"
                    value={createForm.githubUrl || ''}
                    onChange={(e) => updateCreateFormField('githubUrl', e.target.value)}
                    placeholder="https://github.com/usuario/repositorio"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="createShowGithub"
                      checked={createForm.showGithubInPortfolio || false}
                      onChange={(e) => updateCreateFormField('showGithubInPortfolio', e.target.checked)}
                      className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent"
                    />
                    <label htmlFor="createShowGithub" className="text-xs text-tertiary-content">
                      Mostrar enlace de GitHub en el portfolio público
                    </label>
                  </div>
                </div>
              </div>

              {/* Statistics Section */}
              <div className="bg-primary border border-border rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-neutral mb-3">Estadísticas del Servicio</h4>

                {/* Clients Served */}
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    👥 Clientes Atendidos
                  </label>
                  <input
                    type="text"
                    value={createForm.clientsServed || ''}
                    onChange={(e) => updateCreateFormField('clientsServed', e.target.value)}
                    placeholder="ej: 50+, 100 empresas"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="createShowClients"
                      checked={createForm.showClientsServedInPortfolio || false}
                      onChange={(e) => updateCreateFormField('showClientsServedInPortfolio', e.target.checked)}
                      className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent"
                    />
                    <label htmlFor="createShowClients" className="text-xs text-tertiary-content">
                      Mostrar clientes atendidos en portfolio
                    </label>
                  </div>
                </div>

                {/* Projects Completed */}
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    📁 Proyectos Completados
                  </label>
                  <input
                    type="text"
                    value={createForm.projectsCompleted || ''}
                    onChange={(e) => updateCreateFormField('projectsCompleted', e.target.value)}
                    placeholder="ej: 100+, 50 proyectos"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="createShowProjects"
                      checked={createForm.showProjectsCompletedInPortfolio || false}
                      onChange={(e) => updateCreateFormField('showProjectsCompletedInPortfolio', e.target.checked)}
                      className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent"
                    />
                    <label htmlFor="createShowProjects" className="text-xs text-tertiary-content">
                      Mostrar proyectos completados en portfolio
                    </label>
                  </div>
                </div>

                {/* Ratings */}
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    ⭐ Calificación
                  </label>
                  <input
                    type="text"
                    value={createForm.ratings || ''}
                    onChange={(e) => updateCreateFormField('ratings', e.target.value)}
                    placeholder="ej: 4.9/5, 5 estrellas"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="createShowRatings"
                      checked={createForm.showRatingsInPortfolio || false}
                      onChange={(e) => updateCreateFormField('showRatingsInPortfolio', e.target.checked)}
                      className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent"
                    />
                    <label htmlFor="createShowRatings" className="text-xs text-tertiary-content">
                      Mostrar calificación en portfolio
                    </label>
                  </div>
                </div>
              </div>

              {/* Published Status */}
              <div className="bg-primary border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="createIsPublished"
                    checked={createForm.isPublished || false}
                    onChange={(e) => updateCreateFormField('isPublished', e.target.checked)}
                    className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent focus:ring-2"
                  />
                  <label htmlFor="createIsPublished" className="text-sm font-medium text-neutral">
                    Publicar servicio
                  </label>
                </div>
                <p className="text-xs text-tertiary-content mt-1 ml-7">
                  {createForm.isPublished
                    ? "✅ El servicio será visible en tu portfolio público"
                    : "❌ El servicio solo será visible en el dashboard"
                  }
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-accent hover:bg-accent/80 disabled:opacity-50 text-secondary px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  {saving ? 'Creando...' : 'Crear Servicio'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    resetCreateForm()
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Form */}
      {editingService && editForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-secondary border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-neutral mb-4">Editar Servicio</h3>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveService(); }}>
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Título del Servicio *
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => updateFormField('title', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Descripción Corta *
                </label>
                <textarea
                  value={editForm.shortDescription ?? ''}
                  onChange={(e) => updateFormField('shortDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Orden *
                </label>
                <input
                  type="number"
                  value={editForm.order}
                  onChange={(e) => updateFormField('order', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">
                  Imagen del Servicio (opcional)
                </label>
                <div className="mb-3">
                  <label className="block text-sm text-tertiary-content mb-2">
                    Subir nueva imagen:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-secondary hover:file:bg-accent/80"
                  />
                  {previewUrl && (
                    <div className="mt-3">
                      <img
                        src={previewUrl}
                        alt="Vista previa"
                        className="max-w-xs max-h-48 rounded-lg border border-border"
                      />
                    </div>
                  )}
                </div>
                {/* Mostrar imagen actual si existe */}
                {editForm.imageUrl && !selectedFile && (
                  <div className="mb-3">
                    <label className="block text-sm text-tertiary-content mb-2">
                      Imagen actual:
                    </label>
                    <div className="mt-2">
                      <img
                        src={editForm.imageUrl}
                        alt="Imagen actual"
                        className="max-w-xs max-h-48 rounded-lg border border-border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}
                <p className="text-xs text-tertiary-content">
                  La imagen se mostrará junto al emoji en la tarjeta del servicio
                </p>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">
                  Tecnologías / Herramientas
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTechnology(techInput, true)
                      }
                    }}
                    placeholder="ej: React, Node.js, Docker"
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="button"
                    onClick={() => addTechnology(techInput, true)}
                    className="bg-accent hover:bg-accent/80 text-secondary px-4 py-2 rounded-lg transition-colors"
                  >
                    Agregar
                  </button>
                </div>
                {editForm.technologies && editForm.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editForm.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-primary text-primary-content px-3 py-1 rounded-lg text-sm flex items-center gap-2 border border-border"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech, true)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-tertiary-content mt-2">
                  Presiona Enter o click en "Agregar" para añadir cada tecnología
                </p>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Nivel de Experiencia
                </label>
                <input
                  type="text"
                  value={editForm.experienceLevel || ''}
                  onChange={(e) => updateFormField('experienceLevel', e.target.value)}
                  placeholder="ej: 5+ años, Experto, Intermedio"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <p className="text-xs text-tertiary-content mt-1">
                  Este badge se mostrará en la esquina superior de la tarjeta
                </p>
              </div>

              {/* URLs Section */}
              <div className="bg-primary border border-border rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-neutral mb-3">Enlaces y URLs</h4>

                {/* Demo URL */}
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    URL de Vista Previa
                  </label>
                  <input
                    type="url"
                    value={editForm.demoUrl || ''}
                    onChange={(e) => updateFormField('demoUrl', e.target.value)}
                    placeholder="https://ejemplo.com/demo"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="editShowDemo"
                      checked={editForm.showDemoInPortfolio || false}
                      onChange={(e) => updateFormField('showDemoInPortfolio', e.target.checked)}
                      className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent"
                    />
                    <label htmlFor="editShowDemo" className="text-xs text-tertiary-content">
                      Mostrar enlace de Vista Previa en el portfolio público
                    </label>
                  </div>
                </div>

                {/* GitHub URL */}
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    URL de GitHub
                  </label>
                  <input
                    type="url"
                    value={editForm.githubUrl || ''}
                    onChange={(e) => updateFormField('githubUrl', e.target.value)}
                    placeholder="https://github.com/usuario/repositorio"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="editShowGithub"
                      checked={editForm.showGithubInPortfolio || false}
                      onChange={(e) => updateFormField('showGithubInPortfolio', e.target.checked)}
                      className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent"
                    />
                    <label htmlFor="editShowGithub" className="text-xs text-tertiary-content">
                      Mostrar enlace de GitHub en el portfolio público
                    </label>
                  </div>
                </div>
              </div>

              {/* Statistics Section */}
              <div className="bg-primary border border-border rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-neutral mb-3">Estadísticas del Servicio</h4>

                {/* Clients Served */}
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    👥 Clientes Atendidos
                  </label>
                  <input
                    type="text"
                    value={editForm.clientsServed || ''}
                    onChange={(e) => updateFormField('clientsServed', e.target.value)}
                    placeholder="ej: 50+, 100 empresas"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="editShowClients"
                      checked={editForm.showClientsServedInPortfolio || false}
                      onChange={(e) => updateFormField('showClientsServedInPortfolio', e.target.checked)}
                      className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent"
                    />
                    <label htmlFor="editShowClients" className="text-xs text-tertiary-content">
                      Mostrar clientes atendidos en portfolio
                    </label>
                  </div>
                </div>

                {/* Projects Completed */}
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    📁 Proyectos Completados
                  </label>
                  <input
                    type="text"
                    value={editForm.projectsCompleted || ''}
                    onChange={(e) => updateFormField('projectsCompleted', e.target.value)}
                    placeholder="ej: 100+, 50 proyectos"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="editShowProjects"
                      checked={editForm.showProjectsCompletedInPortfolio || false}
                      onChange={(e) => updateFormField('showProjectsCompletedInPortfolio', e.target.checked)}
                      className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent"
                    />
                    <label htmlFor="editShowProjects" className="text-xs text-tertiary-content">
                      Mostrar proyectos completados en portfolio
                    </label>
                  </div>
                </div>

                {/* Ratings */}
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    ⭐ Calificación
                  </label>
                  <input
                    type="text"
                    value={editForm.ratings || ''}
                    onChange={(e) => updateFormField('ratings', e.target.value)}
                    placeholder="ej: 4.9/5, 5 estrellas"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-secondary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="editShowRatings"
                      checked={editForm.showRatingsInPortfolio || false}
                      onChange={(e) => updateFormField('showRatingsInPortfolio', e.target.checked)}
                      className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent"
                    />
                    <label htmlFor="editShowRatings" className="text-xs text-tertiary-content">
                      Mostrar calificación en portfolio
                    </label>
                  </div>
                </div>
              </div>

              {/* Published Status */}
              <div className="bg-primary border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="editIsPublished"
                    checked={editForm.isPublished || false}
                    onChange={(e) => updateFormField('isPublished', e.target.checked)}
                    className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent focus:ring-2"
                  />
                  <label htmlFor="editIsPublished" className="text-sm font-medium text-neutral">
                    Publicar servicio
                  </label>
                </div>
                <p className="text-xs text-tertiary-content mt-1 ml-7">
                  {editForm.isPublished
                    ? "✅ El servicio será visible en tu portfolio público"
                    : "❌ El servicio solo será visible en el dashboard"
                  }
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-accent hover:bg-accent/80 disabled:opacity-50 text-secondary px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <toast.ToastContainer />
    </div>
  )
}
