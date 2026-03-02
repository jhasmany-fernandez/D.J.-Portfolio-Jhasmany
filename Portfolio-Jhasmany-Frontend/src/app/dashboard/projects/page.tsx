'use client'

import { Project } from '@/lib/types'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'

interface ProjectWithId extends Project {
  id: string
}

interface StoredImage {
  id: string
  originalName: string
  mimeType: string
  size: number
  createdAt: string
  url: string
}

const STORED_IMAGE_URL_REGEX = /^\/api\/images\/[0-9a-fA-F-]{36}$/

const sanitizeStoredImageUrl = (value?: string | null) => {
  const normalized = (value || '').trim()
  return STORED_IMAGE_URL_REGEX.test(normalized) ? normalized : ''
}

export default function ProjectsPage() {

  const toast = useToast()
  const [projects, setProjects] = useState<ProjectWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState<Partial<Project>>({
    title: '',
    shortDescription: '',
    type: 'Personal',
    priority: 0,
    cover: ''
  })
  const [editingProject, setEditingProject] = useState<ProjectWithId | null>(null)
  const [editForm, setEditForm] = useState<ProjectWithId | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showSavedImagesModal, setShowSavedImagesModal] = useState(false)
  const [storedImages, setStoredImages] = useState<StoredImage[]>([])
  const [loadingStoredImages, setLoadingStoredImages] = useState(false)
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setProjects(data.projects || [])
      setError(null)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
      setProjects([]) // Ensure projects is set to empty array on error
    } finally {
      setLoading(false)
    }
  }

  // Delete project
  const deleteProject = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchProjects() // Refresh list
        toast.success('Proyecto eliminado exitosamente')
      } else {
        toast.error('Error al eliminar el proyecto')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Error al eliminar el proyecto')
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

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const fetchStoredImages = async () => {
    setLoadingStoredImages(true)
    try {
      const response = await fetch('/api/upload/image', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setStoredImages(data.images || [])
    } catch (error) {
      console.error('Error fetching stored images:', error)
      toast.error('Error loading saved images')
    } finally {
      setLoadingStoredImages(false)
    }
  }

  const openSavedImagesModal = async () => {
    setShowSavedImagesModal(true)
    await fetchStoredImages()
  }

  const selectStoredImage = (url: string) => {
    const safeUrl = sanitizeStoredImageUrl(url)
    setSelectedFile(null)
    setPreviewUrl(safeUrl || null)

    if (editingProject && editForm) {
      setEditForm({ ...editForm, cover: safeUrl, imageUrl: safeUrl })
    } else {
      setCreateForm({ ...createForm, cover: safeUrl, imageUrl: safeUrl })
    }

    setShowSavedImagesModal(false)
  }

  const deleteStoredImage = async (image: StoredImage) => {
    if (!confirm(`Delete image "${image.originalName}"?`)) return

    setDeletingImageId(image.id)
    try {
      const response = await fetch(`/api/upload/image/${image.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setStoredImages((prev) => prev.filter((item) => item.id !== image.id))

      if (previewUrl === image.url) {
        setPreviewUrl(null)
      }

      if (editForm?.cover === image.url) {
        setEditForm({ ...editForm, cover: '' })
      }

      if (createForm.cover === image.url) {
        setCreateForm({ ...createForm, cover: '' })
      }

      toast.success('Image deleted successfully')
    } catch (error) {
      console.error('Error deleting stored image:', error)
      toast.error('Error deleting image')
    } finally {
      setDeletingImageId(null)
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

  // Start editing project
  const startEditing = (project: ProjectWithId) => {
    const safeImageUrl =
      sanitizeStoredImageUrl(project.cover) ||
      sanitizeStoredImageUrl(project.imageUrl)

    setEditingProject(project)
    setEditForm({
      ...project,
      cover: safeImageUrl,
      imageUrl: safeImageUrl,
    })
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingProject(null)
    setEditForm(null)
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  // Update form field
  const updateFormField = (field: keyof ProjectWithId, value: string | number | boolean) => {
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
      type: 'Personal',
      priority: 0,
      cover: ''
    })
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  // Create new project
  const createProject = async () => {
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

      const finalImageUrl = sanitizeStoredImageUrl(
        imageUrl || createForm.cover || createForm.imageUrl || ''
      )

      // Prepare project data
      const projectData = {
        ...createForm,
        cover: finalImageUrl,
        imageUrl: finalImageUrl,
      }


      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      })


      if (response.ok) {
        const result = await response.json()

        await fetchProjects() // Refresh list
        setShowCreateForm(false)
        resetCreateForm()
        toast.success('Proyecto creado exitosamente')
      } else {
        const errorText = await response.text()
        console.error('Create error response:', errorText)
        toast.error('Error al crear el proyecto')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Error al crear el proyecto')
    } finally {
      setSaving(false)
    }
  }

  // Save project changes
  const saveProject = async () => {
    if (!editForm || !editingProject) return

    setSaving(true)
    try {
      let nextCover = editForm.cover || ''
      let nextImageUrl = editForm.imageUrl || ''

      // Upload image first if a file was selected
      if (selectedFile) {
        const imageUrl = await uploadImage()
        if (imageUrl) {
          nextCover = imageUrl
          nextImageUrl = imageUrl
        } else {
          toast.error('Error al subir la imagen. Por favor, intenta de nuevo.')
          setSaving(false)
          return
        }
      }

      // Filter out fields that shouldn't be sent to the backend
      const { id, createdAt, updatedAt, authorId, author, ...updateData } = editForm as any
      const finalImageUrl = sanitizeStoredImageUrl(nextCover || nextImageUrl)
      updateData.cover = finalImageUrl
      updateData.imageUrl = finalImageUrl

      const response = await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })


      if (response.ok) {
        const result = await response.json()

        await fetchProjects() // Refresh list

        cancelEditing() // Close modal
        toast.success('Proyecto actualizado exitosamente')
      } else {
        const errorText = await response.text()
        console.error('Save error response:', errorText)
        toast.error('Error al actualizar el proyecto')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Error al actualizar el proyecto')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral mb-2">Projects Management</h1>
          <p className="text-tertiary-content">Cargando proyectos...</p>
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
          <h1 className="text-3xl font-bold text-neutral mb-2">Projects Management</h1>
          <p className="text-tertiary-content">Error al cargar proyectos</p>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
        <button
          onClick={fetchProjects}
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
        <h1 className="text-3xl font-bold text-neutral mb-2">Projects Management</h1>
        <p className="text-tertiary-content">Gestiona todos tus proyectos del portfolio</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-accent hover:bg-accent/80 text-secondary px-4 py-2 rounded-lg transition-colors duration-200"
        >
          + Nuevo Proyecto
        </button>
        <button className="bg-secondary hover:bg-secondary/80 text-primary-content border border-border px-4 py-2 rounded-lg transition-colors duration-200">
          Actualizar Cache
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="bg-secondary border-border rounded-lg border p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="text-accent text-2xl">
                {project.type?.includes('New') ? '🔥' :
                 project.type?.includes('Client') ? '👤' : '🚀'}
              </div>
              <span className="bg-accent/20 text-accent px-2 py-1 rounded-full text-xs">
                Prioridad {project.priority}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-neutral mb-2 truncate" title={project.title}>
              {project.title}
            </h3>
            <p className="text-tertiary-content text-sm mb-4 line-clamp-3">
              {project.shortDescription}
            </p>

            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="bg-primary/50 text-primary-content px-2 py-1 rounded text-xs">
                {project.type || 'Sin categoría'}
              </span>
              {project.siteAge && (
                <span className="bg-primary/50 text-primary-content px-2 py-1 rounded text-xs">
                  {project.siteAge}
                </span>
              )}
              {project.visitors && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  👥 {project.visitors}
                </span>
              )}
              {project.earned && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  💰 {project.earned}
                </span>
              )}
              {project.githubStars && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                  ⭐ {project.githubStars}
                </span>
              )}
              {project.numberOfSales && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                  🛒 {project.numberOfSales}
                </span>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => startEditing(project)}
                className="bg-accent hover:bg-accent/80 text-secondary px-3 py-1 rounded text-sm transition-colors duration-200"
              >
                Editar
              </button>
              {project.livePreview && (
                <a
                  href={project.livePreview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-1 rounded text-sm transition-colors duration-200 border border-border ${
                    project.showLivePreviewInPortfolio
                      ? 'bg-primary hover:bg-primary/80 text-primary-content'
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                  }`}
                  title={project.showLivePreviewInPortfolio ? 'Visible en portfolio público' : 'Solo visible en dashboard'}
                >
                  🌐 Ver {project.showLivePreviewInPortfolio ? '🌐' : '🔒'}
                </a>
              )}
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${
                    project.showGithubInPortfolio
                      ? 'bg-gray-800 hover:bg-gray-900 text-white'
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                  }`}
                  title={project.showGithubInPortfolio ? 'Visible en portfolio público' : 'Solo visible en dashboard'}
                >
                  📁 GitHub {project.showGithubInPortfolio ? '🌐' : '🔒'}
                </a>
              )}
              <button
                onClick={() => deleteProject(project.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="bg-secondary border-border rounded-lg border p-12 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-neutral mb-2">No hay proyectos</h3>
          <p className="text-tertiary-content mb-6">
            Comienza creando tu primer proyecto para mostrarlo en tu portfolio.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-accent hover:bg-accent/80 text-secondary px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Crear Primer Proyecto
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="bg-secondary border-border rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-neutral mb-4">Estadísticas de Proyectos</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{projects.length}</div>
            <div className="text-sm text-tertiary-content">Total Proyectos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {projects.filter(p => p.livePreview).length}
            </div>
            <div className="text-sm text-tertiary-content">Activos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {projects.filter(p => p.type?.includes('New')).length}
            </div>
            <div className="text-sm text-tertiary-content">Nuevos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {projects.filter(p => p.type?.includes('Client')).length}
            </div>
            <div className="text-sm text-tertiary-content">Cliente</div>
          </div>
        </div>
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-secondary border border-border rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-neutral mb-4">Crear Nuevo Proyecto</h3>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); createProject(); }}>
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Título del Proyecto *
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

              {/* Priority and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    Prioridad *
                  </label>
                  <input
                    type="number"
                    value={createForm.priority || 1}
                    onChange={(e) => updateCreateFormField('priority', parseInt(e.target.value))}
                    min="1"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    Tipo de Proyecto *
                  </label>
                  <select
                    value={createForm.type ?? 'Personal'}
                    onChange={(e) => updateCreateFormField('type', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  >
                    <option value="Client Work 🙍‍♂️">Client Work 🙍‍♂️</option>
                    <option value="New 🔥">New 🔥</option>
                    <option value="Free 🔥">Free 🔥</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">
                  Imagen de Portada
                </label>

                {/* File Upload */}
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
                  <button
                    type="button"
                    onClick={openSavedImagesModal}
                    className="mt-3 bg-primary border border-border hover:bg-accent hover:text-secondary text-primary-content px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Seleccionar imagenes guardadas
                  </button>
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
              </div>

              {/* Live Preview and GitHub */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    URL de Vista Previa
                  </label>
                  <input
                    type="url"
                    value={createForm.livePreview || ''}
                    onChange={(e) => updateCreateFormField('livePreview', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    URL de GitHub
                  </label>
                  <input
                    type="url"
                    value={createForm.githubLink || ''}
                    onChange={(e) => updateCreateFormField('githubLink', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Live Preview Portfolio Visibility Toggle */}
              {createForm.livePreview && (
                <div className="bg-primary border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="createShowLivePreviewInPortfolio"
                      checked={createForm.showLivePreviewInPortfolio || false}
                      onChange={(e) => updateCreateFormField('showLivePreviewInPortfolio', e.target.checked)}
                      className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent focus:ring-2"
                    />
                    <label htmlFor="createShowLivePreviewInPortfolio" className="text-sm font-medium text-neutral">
                      Mostrar enlace de Vista Previa en el portfolio público
                    </label>
                  </div>
                  <p className="text-xs text-tertiary-content mt-1 ml-7">
                    {createForm.showLivePreviewInPortfolio
                      ? "✅ El enlace de Vista Previa será visible en tu portfolio público"
                      : "❌ El enlace de Vista Previa solo será visible en el dashboard"
                    }
                  </p>
                </div>
              )}

              {/* GitHub Portfolio Visibility Toggle */}
              {createForm.githubLink && (
                <div className="bg-primary border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="createShowGithubInPortfolio"
                      checked={createForm.showGithubInPortfolio || false}
                      onChange={(e) => updateCreateFormField('showGithubInPortfolio', e.target.checked)}
                      className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent focus:ring-2"
                    />
                    <label htmlFor="createShowGithubInPortfolio" className="text-sm font-medium text-neutral">
                      Mostrar enlace de GitHub en el portfolio público
                    </label>
                  </div>
                  <p className="text-xs text-tertiary-content mt-1 ml-7">
                    {createForm.showGithubInPortfolio
                      ? "✅ El enlace de GitHub será visible en tu portfolio público"
                      : "❌ El enlace de GitHub solo será visible en el dashboard"
                    }
                  </p>
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    👥 Visitantes del Sitio
                  </label>
                  <input
                    type="text"
                    value={createForm.visitors || ''}
                    onChange={(e) => updateCreateFormField('visitors', e.target.value)}
                    placeholder="ej: 8K, 1.2M"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "👥 [valor] Visitors"</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    💰 Ganancias del Proyecto
                  </label>
                  <input
                    type="text"
                    value={createForm.earned || ''}
                    onChange={(e) => updateCreateFormField('earned', e.target.value)}
                    placeholder="ej: $400, €1,200"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "💰 [valor] Earned"</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    ⭐ Estrellas en GitHub
                  </label>
                  <input
                    type="text"
                    value={createForm.githubStars || ''}
                    onChange={(e) => updateCreateFormField('githubStars', e.target.value)}
                    placeholder="ej: 40, 156"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "⭐ [valor] Stars"</p>
                </div>
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    ⏰ Antigüedad del Sitio
                  </label>
                  <input
                    type="text"
                    value={createForm.siteAge || ''}
                    onChange={(e) => updateCreateFormField('siteAge', e.target.value)}
                    placeholder="ej: 1 month, 2 years"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "⏰ [valor] old"</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    ⭐ Calificaciones de Usuarios
                  </label>
                  <input
                    type="text"
                    value={createForm.ratings || ''}
                    onChange={(e) => updateCreateFormField('ratings', e.target.value)}
                    placeholder="ej: 4.5/5, 4.8"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "⭐ [valor] Rating"</p>
                </div>
              </div>

              {/* Number of Sales */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  🛒 Número de Ventas
                </label>
                <input
                  type="text"
                  value={createForm.numberOfSales || ''}
                  onChange={(e) => updateCreateFormField('numberOfSales', e.target.value)}
                  placeholder="ej: 138, 250+"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "🛒 [valor] Sales"</p>
              </div>

              {/* Statistics Visibility Toggles */}
              <div className="bg-primary border border-border rounded-lg p-4">
                <h4 className="text-sm font-semibold text-neutral mb-4">Controles de Visibilidad en Portfolio Público</h4>
                <div className="space-y-3">

                  {/* Visitors Toggle */}
                  {createForm.visitors && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="createShowVisitorsInPortfolio"
                        checked={createForm.showVisitorsInPortfolio || false}
                        onChange={(e) => updateCreateFormField('showVisitorsInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="createShowVisitorsInPortfolio" className="text-sm font-medium text-neutral block">
                          👥 Mostrar Visitantes
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "👥 [valor] Visitors" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Earnings Toggle */}
                  {createForm.earned && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="createShowEarnedInPortfolio"
                        checked={createForm.showEarnedInPortfolio || false}
                        onChange={(e) => updateCreateFormField('showEarnedInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="createShowEarnedInPortfolio" className="text-sm font-medium text-neutral block">
                          💰 Mostrar Ganancias
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "💰 [valor] Earned" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                  {/* GitHub Stars Toggle */}
                  {createForm.githubStars && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="createShowGithubStarsInPortfolio"
                        checked={createForm.showGithubStarsInPortfolio || false}
                        onChange={(e) => updateCreateFormField('showGithubStarsInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="createShowGithubStarsInPortfolio" className="text-sm font-medium text-neutral block">
                          ⭐ Mostrar Estrellas GitHub
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "⭐ [valor] Stars" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Ratings Toggle */}
                  {createForm.ratings && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="createShowRatingsInPortfolio"
                        checked={createForm.showRatingsInPortfolio || false}
                        onChange={(e) => updateCreateFormField('showRatingsInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="createShowRatingsInPortfolio" className="text-sm font-medium text-neutral block">
                          ⭐ Mostrar Calificaciones
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "⭐ [valor] Rating" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Number of Sales Toggle */}
                  {createForm.numberOfSales && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="createShowNumberOfSalesInPortfolio"
                        checked={createForm.showNumberOfSalesInPortfolio || false}
                        onChange={(e) => updateCreateFormField('showNumberOfSalesInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="createShowNumberOfSalesInPortfolio" className="text-sm font-medium text-neutral block">
                          🛒 Mostrar Ventas
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "🛒 [valor] Sales" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Site Age Toggle */}
                  {createForm.siteAge && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="createShowSiteAgeInPortfolio"
                        checked={createForm.showSiteAgeInPortfolio || false}
                        onChange={(e) => updateCreateFormField('showSiteAgeInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="createShowSiteAgeInPortfolio" className="text-sm font-medium text-neutral block">
                          ⏰ Mostrar Antigüedad
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "⏰ [valor] old" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                </div>
                <p className="text-xs text-tertiary-content mt-4 p-3 bg-accent/10 rounded-lg">
                  💡 Solo las estadísticas marcadas serán visibles en tu portfolio público. Las no marcadas permanecerán privadas en el dashboard.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-accent hover:bg-accent/80 disabled:opacity-50 text-secondary px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  {saving ? 'Creando...' : 'Crear Proyecto'}
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

      {editingProject && editForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-secondary border border-border rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-neutral mb-4">Editar Proyecto</h3>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveProject(); }}>
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Título del Proyecto *
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

              {/* Priority and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    Prioridad *
                  </label>
                  <input
                    type="number"
                    value={editForm.priority}
                    onChange={(e) => updateFormField('priority', parseInt(e.target.value))}
                    min="1"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    Tipo de Proyecto *
                  </label>
                  <select
                    value={editForm.type ?? 'Personal'}
                    onChange={(e) => updateFormField('type', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  >
                    <option value="Client Work 🙍‍♂️">Client Work 🙍‍♂️</option>
                    <option value="New 🔥">New 🔥</option>
                    <option value="Free 🔥">Free 🔥</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">
                  Imagen de Portada
                </label>

                {/* File Upload */}
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
                  <button
                    type="button"
                    onClick={openSavedImagesModal}
                    className="mt-3 bg-primary border border-border hover:bg-accent hover:text-secondary text-primary-content px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Seleccionar imagenes guardadas
                  </button>
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
                {editForm.cover && !selectedFile && (
                  <div className="mb-3">
                    <label className="block text-sm text-tertiary-content mb-2">
                      Imagen actual:
                    </label>
                    <div className="mt-2">
                      <img
                        src={editForm.cover}
                        alt="Imagen actual"
                        className="max-w-xs max-h-48 rounded-lg border border-border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Live Preview and GitHub */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    URL de Vista Previa
                  </label>
                  <input
                    type="url"
                    value={editForm.livePreview || ''}
                    onChange={(e) => updateFormField('livePreview', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    URL de GitHub
                  </label>
                  <input
                    type="url"
                    value={editForm.githubLink || ''}
                    onChange={(e) => updateFormField('githubLink', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Live Preview Portfolio Visibility Toggle */}
              {editForm.livePreview && (
                <div className="bg-primary border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="showLivePreviewInPortfolio"
                      checked={editForm.showLivePreviewInPortfolio || false}
                      onChange={(e) => updateFormField('showLivePreviewInPortfolio', e.target.checked)}
                      className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent focus:ring-2"
                    />
                    <label htmlFor="showLivePreviewInPortfolio" className="text-sm font-medium text-neutral">
                      Mostrar enlace de Vista Previa en el portfolio público
                    </label>
                  </div>
                  <p className="text-xs text-tertiary-content mt-1 ml-7">
                    {editForm.showLivePreviewInPortfolio
                      ? "✅ El enlace de Vista Previa será visible en tu portfolio público"
                      : "❌ El enlace de Vista Previa solo será visible en el dashboard"
                    }
                  </p>
                </div>
              )}

              {/* GitHub Portfolio Visibility Toggle */}
              {editForm.githubLink && (
                <div className="bg-primary border border-border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="showGithubInPortfolio"
                      checked={editForm.showGithubInPortfolio || false}
                      onChange={(e) => updateFormField('showGithubInPortfolio', e.target.checked)}
                      className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent focus:ring-2"
                    />
                    <label htmlFor="showGithubInPortfolio" className="text-sm font-medium text-neutral">
                      Mostrar enlace de GitHub en el portfolio público
                    </label>
                  </div>
                  <p className="text-xs text-tertiary-content mt-1 ml-7">
                    {editForm.showGithubInPortfolio
                      ? "✅ El enlace de GitHub será visible en tu portfolio público"
                      : "❌ El enlace de GitHub solo será visible en el dashboard"
                    }
                  </p>
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    👥 Visitantes del Sitio
                  </label>
                  <input
                    type="text"
                    value={editForm.visitors || ''}
                    onChange={(e) => updateFormField('visitors', e.target.value)}
                    placeholder="ej: 8K, 1.2M"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "👥 [valor] Visitors"</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    💰 Ganancias del Proyecto
                  </label>
                  <input
                    type="text"
                    value={editForm.earned || ''}
                    onChange={(e) => updateFormField('earned', e.target.value)}
                    placeholder="ej: $400, €1,200"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "💰 [valor] Earned"</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    ⭐ Estrellas en GitHub
                  </label>
                  <input
                    type="text"
                    value={editForm.githubStars || ''}
                    onChange={(e) => updateFormField('githubStars', e.target.value)}
                    placeholder="ej: 40, 156"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "⭐ [valor] Stars"</p>
                </div>
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    ⏰ Antigüedad del Sitio
                  </label>
                  <input
                    type="text"
                    value={editForm.siteAge || ''}
                    onChange={(e) => updateFormField('siteAge', e.target.value)}
                    placeholder="ej: 1 month, 2 years"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "⏰ [valor] old"</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral mb-1">
                    ⭐ Calificaciones de Usuarios
                  </label>
                  <input
                    type="text"
                    value={editForm.ratings || ''}
                    onChange={(e) => updateFormField('ratings', e.target.value)}
                    placeholder="ej: 4.5/5, 4.8"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "⭐ [valor] Rating"</p>
                </div>
              </div>

              {/* Number of Sales */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  🛒 Número de Ventas
                </label>
                <input
                  type="text"
                  value={editForm.numberOfSales || ''}
                  onChange={(e) => updateFormField('numberOfSales', e.target.value)}
                  placeholder="ej: 138, 250+"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <p className="text-xs text-tertiary-content mt-1">Se mostrará como: "🛒 [valor] Sales"</p>
              </div>

              {/* Statistics Visibility Toggles */}
              <div className="bg-primary border border-border rounded-lg p-4">
                <h4 className="text-sm font-semibold text-neutral mb-4">Controles de Visibilidad en Portfolio Público</h4>
                <div className="space-y-3">

                  {/* Visitors Toggle */}
                  {editForm.visitors && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="showVisitorsInPortfolio"
                        checked={editForm.showVisitorsInPortfolio || false}
                        onChange={(e) => updateFormField('showVisitorsInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="showVisitorsInPortfolio" className="text-sm font-medium text-neutral block">
                          👥 Mostrar Visitantes
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "👥 [valor] Visitors" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Earnings Toggle */}
                  {editForm.earned && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="showEarnedInPortfolio"
                        checked={editForm.showEarnedInPortfolio || false}
                        onChange={(e) => updateFormField('showEarnedInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="showEarnedInPortfolio" className="text-sm font-medium text-neutral block">
                          💰 Mostrar Ganancias
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "💰 [valor] Earned" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                  {/* GitHub Stars Toggle */}
                  {editForm.githubStars && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="showGithubStarsInPortfolio"
                        checked={editForm.showGithubStarsInPortfolio || false}
                        onChange={(e) => updateFormField('showGithubStarsInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="showGithubStarsInPortfolio" className="text-sm font-medium text-neutral block">
                          ⭐ Mostrar Estrellas GitHub
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "⭐ [valor] Stars" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Ratings Toggle */}
                  {editForm.ratings && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="showRatingsInPortfolio"
                        checked={editForm.showRatingsInPortfolio || false}
                        onChange={(e) => updateFormField('showRatingsInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="showRatingsInPortfolio" className="text-sm font-medium text-neutral block">
                          ⭐ Mostrar Calificaciones
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "⭐ [valor] Rating" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Number of Sales Toggle */}
                  {editForm.numberOfSales && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="showNumberOfSalesInPortfolio"
                        checked={editForm.showNumberOfSalesInPortfolio || false}
                        onChange={(e) => updateFormField('showNumberOfSalesInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="showNumberOfSalesInPortfolio" className="text-sm font-medium text-neutral block">
                          🛒 Mostrar Ventas
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "🛒 [valor] Sales" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Site Age Toggle */}
                  {editForm.siteAge && (
                    <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="showSiteAgeInPortfolio"
                        checked={editForm.showSiteAgeInPortfolio || false}
                        onChange={(e) => updateFormField('showSiteAgeInPortfolio', e.target.checked)}
                        className="w-4 h-4 text-accent bg-primary border-border rounded focus:ring-accent focus:ring-2 mt-0.5"
                      />
                      <div className="flex-1">
                        <label htmlFor="showSiteAgeInPortfolio" className="text-sm font-medium text-neutral block">
                          ⏰ Mostrar Antigüedad
                        </label>
                        <p className="text-xs text-tertiary-content">
                          Muestra: "⏰ [valor] old" en el portfolio público
                        </p>
                      </div>
                    </div>
                  )}

                </div>
                <p className="text-xs text-tertiary-content mt-4 p-3 bg-accent/10 rounded-lg">
                  💡 Solo las estadísticas marcadas serán visibles en tu portfolio público. Las no marcadas permanecerán privadas en el dashboard.
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

      {showSavedImagesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary border border-border rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-neutral">Imagenes guardadas</h3>
              <button
                type="button"
                onClick={() => setShowSavedImagesModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors duration-200"
              >
                Cerrar
              </button>
            </div>

            <div className="mb-4">
              <button
                type="button"
                onClick={fetchStoredImages}
                className="bg-accent hover:bg-accent/80 text-secondary px-4 py-2 rounded-lg transition-colors duration-200"
                disabled={loadingStoredImages}
              >
                {loadingStoredImages ? 'Cargando...' : 'Actualizar lista'}
              </button>
            </div>

            {loadingStoredImages ? (
              <div className="text-tertiary-content">Loading images...</div>
            ) : storedImages.length === 0 ? (
              <div className="text-tertiary-content">No saved images found.</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {storedImages.map((image) => (
                  <div key={image.id} className="bg-primary border border-border rounded-lg p-3">
                    <img
                      src={image.url}
                      alt={image.originalName}
                      className="w-full h-36 object-cover rounded-lg border border-border mb-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                    <div className="text-xs text-tertiary-content mb-1 truncate" title={image.originalName}>
                      {image.originalName}
                    </div>
                    <div className="text-xs text-tertiary-content mb-3">
                      {formatBytes(image.size)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => selectStoredImage(image.url)}
                        className="flex-1 bg-accent hover:bg-accent/80 text-secondary px-3 py-2 rounded text-sm transition-colors duration-200"
                      >
                        Seleccionar
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteStoredImage(image)}
                        disabled={deletingImageId === image.id}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-2 rounded text-sm transition-colors duration-200"
                      >
                        {deletingImageId === image.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <toast.ToastContainer />
    </div>
  )
}
