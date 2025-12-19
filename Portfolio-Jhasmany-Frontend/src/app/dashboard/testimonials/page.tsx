'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/useToast'

interface Testimonial {
  id: string
  name: string
  title?: string
  feedback: string
  image: string
  stars: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export default function TestimonialsPage() {
  const toast = useToast()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [feedback, setFeedback] = useState('')
  const [image, setImage] = useState('')
  const [stars, setStars] = useState(5)
  const [isPublished, setIsPublished] = useState(true)

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Section data state
  const [sectionData, setSectionData] = useState<{ id: string; subtitle: string } | null>(null)
  const [editingSection, setEditingSection] = useState(false)
  const [sectionSubtitle, setSectionSubtitle] = useState('')

  useEffect(() => {
    fetchTestimonials()
    fetchSectionData()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      } else {
        toast.error('Error al cargar testimonials')
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      toast.error('Error al cargar testimonials')
    } finally {
      setLoading(false)
    }
  }

  const fetchSectionData = async () => {
    try {
      const response = await fetch('/api/testimonials-section')
      if (response.ok) {
        const data = await response.json()
        setSectionData(data)
        setSectionSubtitle(data.subtitle)
      }
    } catch (error) {
      console.error('Error fetching section data:', error)
    }
  }

  const updateSectionData = async () => {
    if (!sectionData) return

    try {
      const response = await fetch(`/api/testimonials-section/${sectionData.id}`, {
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

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return null

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        toast.success('Imagen subida exitosamente')
        return result.url
      } else {
        let errorMessage = `Upload failed with status ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        }
        toast.error(`Error al subir imagen: ${errorMessage}`)
        return null
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error(`Error al subir imagen: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const resetForm = () => {
    setName('')
    setTitle('')
    setFeedback('')
    setImage('')
    setStars(5)
    setIsPublished(true)
    setIsCreating(false)
    setEditingId(null)
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !feedback) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    if (!selectedFile && !image) {
      toast.error('Por favor selecciona una imagen')
      return
    }

    try {
      let imageUrl = image

      // Upload image first if a file was selected
      if (selectedFile) {
        const uploadedUrl = await uploadImage()
        if (!uploadedUrl) {
          toast.error('Error al subir imagen. Por favor intenta nuevamente.')
          return
        }
        imageUrl = uploadedUrl
      }

      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          title: title || undefined,
          feedback,
          image: imageUrl,
          stars,
          isPublished,
        }),
      })

      if (response.ok) {
        toast.success('Testimonial creado exitosamente')
        resetForm()
        fetchTestimonials()
      } else {
        toast.error('Error al crear testimonial')
      }
    } catch (error) {
      console.error('Error creating testimonial:', error)
      toast.error('Error al crear testimonial')
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id)
    setName(testimonial.name)
    setTitle(testimonial.title || '')
    setFeedback(testimonial.feedback)
    setImage(testimonial.image)
    setStars(testimonial.stars)
    setIsPublished(testimonial.isPublished)
    setIsCreating(false)
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingId || !name || !feedback) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    if (!selectedFile && !image) {
      toast.error('Por favor selecciona una imagen')
      return
    }

    try {
      let imageUrl = image

      // Upload new image if a file was selected
      if (selectedFile) {
        const uploadedUrl = await uploadImage()
        if (!uploadedUrl) {
          toast.error('Error al subir imagen. Por favor intenta nuevamente.')
          return
        }
        imageUrl = uploadedUrl
      }

      const response = await fetch(`/api/testimonials/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          title: title || undefined,
          feedback,
          image: imageUrl,
          stars,
          isPublished,
        }),
      })

      if (response.ok) {
        toast.success('Testimonial actualizado exitosamente')
        resetForm()
        fetchTestimonials()
      } else {
        toast.error('Error al actualizar testimonial')
      }
    } catch (error) {
      console.error('Error updating testimonial:', error)
      toast.error('Error al actualizar testimonial')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este testimonial?')) {
      return
    }

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Testimonial eliminado exitosamente')
        fetchTestimonials()
      } else {
        toast.error('Error al eliminar testimonial')
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      toast.error('Error al eliminar testimonial')
    }
  }

  const togglePublish = async (testimonial: Testimonial) => {
    try {
      const response = await fetch(`/api/testimonials/${testimonial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPublished: !testimonial.isPublished,
        }),
      })

      if (response.ok) {
        toast.success(
          testimonial.isPublished
            ? 'Testimonial ocultado exitosamente'
            : 'Testimonial publicado exitosamente'
        )
        fetchTestimonials()
      } else {
        toast.error('Error al cambiar estado de publicación')
      }
    } catch (error) {
      console.error('Error toggling publish:', error)
      toast.error('Error al cambiar estado de publicación')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-primary-content">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-content mb-2">Testimonials Management</h1>
        <p className="text-tertiary-content">Gestiona todos los testimonials de tu portfolio</p>
      </div>

      {/* Section Subtitle Editor */}
      <div className="bg-secondary border border-border rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary-content">
            Subtítulo de la Sección
          </h2>
          {!editingSection && (
            <button
              onClick={() => setEditingSection(true)}
              className="px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors"
            >
              Editar
            </button>
          )}
        </div>

        {editingSection ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-content mb-2">
                Texto del subtítulo
              </label>
              <textarea
                value={sectionSubtitle}
                onChange={(e) => setSectionSubtitle(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Escribe el subtítulo de la sección..."
              />
              <p className="text-xs text-tertiary-content mt-1">
                Este texto aparecerá debajo del título "// Testimonials" en la página principal
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={updateSectionData}
                className="px-6 py-2 bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => {
                  setEditingSection(false)
                  setSectionSubtitle(sectionData?.subtitle || '')
                }}
                className="px-6 py-2 bg-secondary border border-border text-primary-content rounded-lg hover:bg-primary transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-tertiary-content italic">
              "{sectionSubtitle || 'No hay subtítulo configurado'}"
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-secondary border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-primary-content mb-4">
            {editingId ? 'Editar Testimonial' : 'Crear Nuevo Testimonial'}
          </h2>
          <form onSubmit={editingId ? handleUpdate : handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-content mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-primary border border-border rounded-lg text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Ej: John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-content mb-2">
                  Título / Cargo
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-primary border border-border rounded-lg text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Ej: CEO de Empresa"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-content mb-2">
                Testimonio *
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-primary border border-border rounded-lg text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Escribe el testimonio aquí..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-content mb-2">
                Imagen *
              </label>
              <div className="mb-3">
                <label className="block text-sm text-tertiary-content mb-2">
                  Subir imagen:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-primary-content focus:outline-none focus:ring-2 focus:ring-accent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-black hover:file:bg-accent/80"
                />
                {(previewUrl || (editingId && image)) && (
                  <div className="mt-3">
                    <img
                      src={previewUrl || image}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-tertiary-content">
                La imagen se mostrará en la sección de testimonios
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-content mb-2">
                  Calificación (Estrellas) *
                </label>
                <select
                  value={stars}
                  onChange={(e) => setStars(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-primary border border-border rounded-lg text-primary-content focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                >
                  <option value={1}>⭐ 1 Estrella</option>
                  <option value={2}>⭐⭐ 2 Estrellas</option>
                  <option value={3}>⭐⭐⭐ 3 Estrellas</option>
                  <option value={4}>⭐⭐⭐⭐ 4 Estrellas</option>
                  <option value={5}>⭐⭐⭐⭐⭐ 5 Estrellas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-content mb-2">
                  Estado
                </label>
                <div className="flex items-center gap-4 mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent"
                    />
                    <span className="text-primary-content">Publicado</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors"
              >
                {editingId ? 'Actualizar Testimonial' : 'Crear Testimonial'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-secondary border border-border text-primary-content rounded-lg hover:bg-primary transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Button */}
      {!isCreating && !editingId && (
        <button
          onClick={() => setIsCreating(true)}
          className="mb-6 px-6 py-3 bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors"
        >
          + Crear Nuevo Testimonial
        </button>
      )}

      {/* Testimonials List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary-content mb-4">
          Testimonials ({testimonials.length})
        </h2>
        {testimonials.length === 0 ? (
          <div className="bg-secondary border border-border rounded-lg p-8 text-center">
            <p className="text-tertiary-content">No hay testimonials creados aún.</p>
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-secondary border border-border rounded-lg p-6 hover:border-accent transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-primary-content">
                        {testimonial.name}
                      </h3>
                      {testimonial.title && (
                        <span className="text-sm text-tertiary-content">
                          • {testimonial.title}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={i < testimonial.stars ? 'text-yellow-500' : 'text-gray-400'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <p className="text-tertiary-content text-sm mb-2 line-clamp-2">
                      "{testimonial.feedback}"
                    </p>
                    <div className="flex items-center gap-4 text-xs text-tertiary-content">
                      <span>Creado: {new Date(testimonial.createdAt).toLocaleDateString()}</span>
                      <span
                        className={`px-2 py-1 rounded ${
                          testimonial.isPublished
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {testimonial.isPublished ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="px-4 py-2 bg-primary border border-border text-primary-content rounded hover:bg-accent hover:text-white transition-colors text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => togglePublish(testimonial)}
                    className="px-4 py-2 bg-primary border border-border text-primary-content rounded hover:bg-blue-500 hover:text-white transition-colors text-sm"
                  >
                    {testimonial.isPublished ? 'Ocultar' : 'Publicar'}
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="px-4 py-2 bg-primary border border-border text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
