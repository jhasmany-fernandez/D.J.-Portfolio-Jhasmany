'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'

interface HomeSection {
  id: string
  greeting: string
  roles: string[]
  description: string
  imageUrl?: string
  primaryButtonText?: string
  primaryButtonUrl?: string
  secondaryButtonText?: string
  secondaryButtonUrl?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

interface StoredImage {
  id: string
  originalName: string
  mimeType: string
  size: number
  createdAt: string
  url: string
}

type ImageSection = 'Home' | 'Projects' | 'Skills' | 'Services' | 'Sin seccion'

export default function HomePage() {
  const toast = useToast()
  const [homeSections, setHomeSections] = useState<HomeSection[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<HomeSection | null>(null)
  const [editForm, setEditForm] = useState<HomeSection | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState<Partial<HomeSection>>({
    greeting: '',
    roles: [''],
    description: '',
    imageUrl: '',
    primaryButtonText: 'Acceso Personal',
    primaryButtonUrl: '/auth/login',
    secondaryButtonText: 'Newsletter Clientes',
    secondaryButtonUrl: '/newsletter/subscribe',
    isActive: false
  })
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showSavedImagesModal, setShowSavedImagesModal] = useState(false)
  const [storedImages, setStoredImages] = useState<StoredImage[]>([])
  const [loadingStoredImages, setLoadingStoredImages] = useState(false)
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)
  const [imageUsageById, setImageUsageById] = useState<Record<string, ImageSection[]>>({})

  // Fetch home sections
  const fetchHomeSections = async () => {
    try {
      const response = await fetch('/api/home')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setHomeSections(data.homeSections || [])
    } catch (error) {
      console.error('Error fetching home sections:', error)
      toast.error('Error loading home sections')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHomeSections()
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const sectionOrder: ImageSection[] = ['Home', 'Projects', 'Skills', 'Services', 'Sin seccion']

  const extractImageIdFromUrl = (url?: string | null) => {
    if (!url) return null
    const match = url.match(/\/api\/images\/([0-9a-fA-F-]{36})/)
    return match ? match[1] : null
  }

  const addUsage = (
    map: Record<string, ImageSection[]>,
    imageId: string | null,
    section: Exclude<ImageSection, 'Sin seccion'>
  ) => {
    if (!imageId) return
    if (!map[imageId]) {
      map[imageId] = [section]
      return
    }
    if (!map[imageId].includes(section)) {
      map[imageId].push(section)
    }
  }

  const fetchImageUsageBySection = async (): Promise<Record<string, ImageSection[]>> => {
    const usageMap: Record<string, ImageSection[]> = {}

    const [homeRes, projectsRes, skillsRes, servicesRes] = await Promise.all([
      fetch('/api/home', { cache: 'no-store' }),
      fetch('/api/projects', { cache: 'no-store' }),
      fetch('/api/skills', { cache: 'no-store' }),
      fetch('/api/services', { cache: 'no-store' }),
    ])

    if (homeRes.ok) {
      const homeData = await homeRes.json()
      for (const section of homeData.homeSections || []) {
        addUsage(usageMap, extractImageIdFromUrl(section.imageUrl), 'Home')
      }
    }

    if (projectsRes.ok) {
      const projectsData = await projectsRes.json()
      for (const project of projectsData.projects || []) {
        addUsage(usageMap, extractImageIdFromUrl(project.imageUrl), 'Projects')
        addUsage(usageMap, extractImageIdFromUrl(project.cover), 'Projects')
      }
    }

    if (skillsRes.ok) {
      const skillsData = await skillsRes.json()
      for (const skill of skillsData.skills || []) {
        addUsage(usageMap, extractImageIdFromUrl(skill.imageUrl), 'Skills')
        addUsage(usageMap, extractImageIdFromUrl(skill.icon), 'Skills')
      }
    }

    if (servicesRes.ok) {
      const servicesData = await servicesRes.json()
      for (const service of servicesData.services || []) {
        addUsage(usageMap, extractImageIdFromUrl(service.imageUrl), 'Services')
        addUsage(usageMap, extractImageIdFromUrl(service.icon), 'Services')
      }
    }

    return usageMap
  }

  const fetchStoredImages = async () => {
    setLoadingStoredImages(true)
    try {
      const [imagesResponse, usageMap] = await Promise.all([
        fetch('/api/upload/image', { cache: 'no-store' }),
        fetchImageUsageBySection(),
      ])

      if (!imagesResponse.ok) {
        throw new Error(`HTTP error! status: ${imagesResponse.status}`)
      }

      const data = await imagesResponse.json()
      setStoredImages(data.images || [])
      setImageUsageById(usageMap)
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
    setSelectedFile(null)
    setPreviewUrl(url)

    if (editingSection && editForm) {
      setEditForm({ ...editForm, imageUrl: url })
    } else {
      setCreateForm({ ...createForm, imageUrl: url })
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
      setImageUsageById((prev) => {
        const next = { ...prev }
        delete next[image.id]
        return next
      })

      if (previewUrl === image.url) {
        setPreviewUrl(null)
      }

      if (editForm?.imageUrl === image.url) {
        setEditForm({ ...editForm, imageUrl: '' })
      }

      if (createForm.imageUrl === image.url) {
        setCreateForm({ ...createForm, imageUrl: '' })
      }

      toast.success('Image deleted successfully')
    } catch (error) {
      console.error('Error deleting stored image:', error)
      toast.error('Error deleting image')
    } finally {
      setDeletingImageId(null)
    }
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  // Upload image
  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return null

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  // Create new section
  const createSection = async () => {
    if (!createForm.greeting?.trim()) {
      toast.error('Greeting is required')
      return
    }

    if (!createForm.roles || createForm.roles.length === 0 || !createForm.roles[0].trim()) {
      toast.error('At least one role is required')
      return
    }

    setSaving(true)
    try {
      // Upload image first if a file was selected
      let imageUrl = createForm.imageUrl
      if (selectedFile) {
        const uploadedUrl = await uploadImage()
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        } else {
          toast.error('Error uploading image. Please try again.')
          setSaving(false)
          return
        }
      }

      const sectionData = {
        ...createForm,
        imageUrl: imageUrl || '',
        roles: createForm.roles?.filter(r => r.trim()) || []
      }

      const response = await fetch('/api/home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sectionData)
      })

      if (response.ok) {
        await fetchHomeSections()
        setShowCreateForm(false)
        resetCreateForm()
        toast.success('Home section created successfully')
      } else {
        toast.error('Error creating home section')
      }
    } catch (error) {
      console.error('Error creating home section:', error)
      toast.error('Error creating home section')
    } finally {
      setSaving(false)
    }
  }

  // Reset create form
  const resetCreateForm = () => {
    setCreateForm({
      greeting: '',
      roles: [''],
      description: '',
      imageUrl: '',
      primaryButtonText: 'Acceso Personal',
      primaryButtonUrl: '/auth/login',
      secondaryButtonText: 'Newsletter Clientes',
      secondaryButtonUrl: '/newsletter/subscribe',
      isActive: false
    })
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  // Start editing
  const startEditing = (section: HomeSection) => {
    setEditingSection(section)
    setEditForm({ ...section })
    setPreviewUrl(section.imageUrl || null)
    setSelectedFile(null)
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingSection(null)
    setEditForm(null)
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  // Save changes
  const saveSection = async () => {
    if (!editForm || !editingSection) return

    if (!editForm.greeting?.trim()) {
      toast.error('Greeting is required')
      return
    }

    if (!editForm.roles || editForm.roles.length === 0) {
      toast.error('At least one role is required')
      return
    }

    setSaving(true)
    try {
      // Upload image first if a file was selected
      if (selectedFile) {
        const imageUrl = await uploadImage()
        if (imageUrl) {
          editForm.imageUrl = imageUrl
        } else {
          toast.error('Error uploading image. Please try again.')
          setSaving(false)
          return
        }
      }

      const { id, createdAt, updatedAt, author, authorId, ...updateData } = editForm as any

      const response = await fetch(`/api/home/${editingSection.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        await fetchHomeSections()
        cancelEditing()
        toast.success('Home section updated successfully')
      } else {
        toast.error('Error updating home section')
      }
    } catch (error) {
      console.error('Error updating home section:', error)
      toast.error('Error updating home section')
    } finally {
      setSaving(false)
    }
  }

  // Set as active
  const setActive = async (id: string) => {
    try {
      const response = await fetch(`/api/home/${id}`, {
        method: 'PUT',
      })

      if (response.ok) {
        await fetchHomeSections()
        toast.success('Home section set as active')
      } else {
        toast.error('Error setting active section')
      }
    } catch (error) {
      console.error('Error setting active:', error)
      toast.error('Error setting active section')
    }
  }

  // Delete section
  const deleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this home section?')) return

    try {
      const response = await fetch(`/api/home/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchHomeSections()
        toast.success('Home section deleted successfully')
      } else {
        toast.error('Error deleting home section')
      }
    } catch (error) {
      console.error('Error deleting home section:', error)
      toast.error('Error deleting home section')
    }
  }

  // Add role to create form
  const addCreateRole = () => {
    setCreateForm({
      ...createForm,
      roles: [...(createForm.roles || []), '']
    })
  }

  // Remove role from create form
  const removeCreateRole = (index: number) => {
    const newRoles = createForm.roles?.filter((_, i) => i !== index) || []
    setCreateForm({
      ...createForm,
      roles: newRoles
    })
  }

  // Update role in create form
  const updateCreateRole = (index: number, value: string) => {
    const newRoles = [...(createForm.roles || [])]
    newRoles[index] = value
    setCreateForm({
      ...createForm,
      roles: newRoles
    })
  }

  // Add role to edit form
  const addEditRole = () => {
    if (editForm) {
      setEditForm({
        ...editForm,
        roles: [...editForm.roles, '']
      })
    }
  }

  // Remove role from edit form
  const removeEditRole = (index: number) => {
    if (editForm) {
      const newRoles = editForm.roles.filter((_, i) => i !== index)
      setEditForm({
        ...editForm,
        roles: newRoles
      })
    }
  }

  // Update role in edit form
  const updateEditRole = (index: number, value: string) => {
    if (editForm) {
      const newRoles = [...editForm.roles]
      newRoles[index] = value
      setEditForm({
        ...editForm,
        roles: newRoles
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-neutral">Loading...</div>
      </div>
    )
  }

  const currentSection = homeSections.find((section) => section.isActive) ?? homeSections[0]
  const getPrimarySection = (imageId: string): ImageSection => {
    const usage = imageUsageById[imageId] || []
    for (const section of sectionOrder) {
      if (section !== 'Sin seccion' && usage.includes(section)) {
        return section
      }
    }
    return 'Sin seccion'
  }

  const groupedStoredImages = sectionOrder
    .map((section) => ({
      section,
      images: storedImages.filter((image) => getPrimarySection(image.id) === section),
    }))
    .filter((group) => group.images.length > 0)

  return (
    <div className="p-6 max-w-7xl">
      <toast.ToastContainer />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral mb-2">Home Section</h1>
        <p className="text-tertiary-content">Edit the current hero content shown on your home page.</p>
      </div>

      {/* Current Home Section */}
      {currentSection && (
        <div className="max-w-3xl">
          <div className="bg-secondary border-border rounded-lg border p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col">
            {/* Image */}
            {currentSection.imageUrl && (
              <div className="mb-4">
                <img
                  src={currentSection.imageUrl}
                  alt="Hero"
                  className="w-full h-32 object-cover rounded-lg border border-border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}

            {/* Greeting */}
            <h3 className="text-lg font-semibold text-neutral mb-2 truncate" title={currentSection.greeting}>
              {currentSection.greeting}
            </h3>

            {/* Roles */}
            <div className="mb-3">
              <span className="text-tertiary-content text-xs">Roles:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {currentSection.roles.map((role, idx) => (
                  <span key={idx} className="bg-primary border border-border px-2 py-1 rounded text-xs text-neutral">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-tertiary-content text-sm mb-4 line-clamp-2" title={currentSection.description}>
              {currentSection.description}
            </p>

            <div className="mb-4 space-y-1">
              <div className="text-xs text-tertiary-content">
                Boton primario: <span className="text-neutral">{currentSection.primaryButtonText || 'Acceso Personal'}</span>
              </div>
              <div className="text-xs text-tertiary-content">
                URL primaria: <span className="text-neutral">{currentSection.primaryButtonUrl || '/auth/login'}</span>
              </div>
              <div className="text-xs text-tertiary-content">
                Boton secundario: <span className="text-neutral">{currentSection.secondaryButtonText || 'Newsletter Clientes'}</span>
              </div>
              <div className="text-xs text-tertiary-content">
                URL secundaria: <span className="text-neutral">{currentSection.secondaryButtonUrl || '/newsletter/subscribe'}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              {currentSection.isActive ? (
                <span className="bg-green-500/20 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  Active section
                </span>
              ) : (
                <span className="bg-gray-500/20 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                  Inactive section
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto max-w-xs">
              <button
                onClick={() => startEditing(currentSection)}
                className="flex-1 bg-accent hover:bg-accent/80 text-secondary px-3 py-2 rounded text-sm transition-colors duration-200 font-medium"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {homeSections.length === 0 && (
        <div className="bg-secondary border-border rounded-lg border p-12 text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-neutral mb-2">No home section yet</h3>
          <p className="text-tertiary-content mb-6">
            Create your initial home section for the hero area.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-accent hover:bg-accent/80 text-secondary px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Create Initial Section
          </button>
        </div>
      )}

      {/* Create Home Section Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary border border-border rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-neutral mb-4">Create New Home Section</h3>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); createSection(); }}>
              {/* Greeting */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Greeting *
                </label>
                <input
                  type="text"
                  value={createForm.greeting ?? ''}
                  onChange={(e) => setCreateForm({ ...createForm, greeting: e.target.value })}
                  placeholder="Hi - I'm Your Name"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Roles */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Roles (will rotate automatically) *
                </label>
                {createForm.roles?.map((role, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => updateCreateRole(idx, e.target.value)}
                      placeholder="FULLSTACK DEVELOPER"
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    {createForm.roles && createForm.roles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCreateRole(idx)}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCreateRole}
                  className="bg-accent text-secondary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 mt-2"
                >
                  + Add Role
                </button>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Description *
                </label>
                <textarea
                  value={createForm.description ?? ''}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  rows={3}
                  placeholder="Crafting innovative solutions..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Texto Boton Primario *
                </label>
                <input
                  type="text"
                  value={createForm.primaryButtonText ?? ''}
                  onChange={(e) => setCreateForm({ ...createForm, primaryButtonText: e.target.value })}
                  placeholder="Acceso Personal"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  URL Boton Primario *
                </label>
                <input
                  type="text"
                  value={createForm.primaryButtonUrl ?? ''}
                  onChange={(e) => setCreateForm({ ...createForm, primaryButtonUrl: e.target.value })}
                  placeholder="/auth/login"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Texto Boton Secundario *
                </label>
                <input
                  type="text"
                  value={createForm.secondaryButtonText ?? ''}
                  onChange={(e) => setCreateForm({ ...createForm, secondaryButtonText: e.target.value })}
                  placeholder="Newsletter Clientes"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  URL Boton Secundario *
                </label>
                <input
                  type="text"
                  value={createForm.secondaryButtonUrl ?? ''}
                  onChange={(e) => setCreateForm({ ...createForm, secondaryButtonUrl: e.target.value })}
                  placeholder="/newsletter/subscribe"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">
                  Hero Image (optional)
                </label>
                <button
                  type="button"
                  onClick={openSavedImagesModal}
                  className="mb-3 bg-primary hover:bg-primary/80 text-primary-content border border-border px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Seleccionar imagenes guardadas
                </button>
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
                      alt="Preview"
                      className="max-w-xs max-h-48 rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>

              {/* Active Status */}
              <div className="bg-primary border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="createIsActive"
                    checked={createForm.isActive ?? false}
                    onChange={(e) => setCreateForm({ ...createForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent focus:ring-2"
                  />
                  <label htmlFor="createIsActive" className="text-sm font-medium text-neutral">
                    Set as active section
                  </label>
                </div>
                <p className="text-xs text-tertiary-content mt-1 ml-7">
                  {createForm.isActive
                    ? "✅ This section will be displayed on the home page"
                    : "❌ This section will be saved but not displayed"
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
                  {saving ? 'Creating...' : 'Create Section'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    resetCreateForm()
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Home Section Form */}
      {editingSection && editForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary border border-border rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-neutral mb-4">Edit Home Section</h3>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveSection(); }}>
              {/* Greeting */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Greeting *
                </label>
                <input
                  type="text"
                  value={editForm.greeting}
                  onChange={(e) => setEditForm({ ...editForm, greeting: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Hi - I'm Your Name"
                  required
                />
              </div>

              {/* Roles */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Roles (will rotate automatically) *
                </label>
                {editForm.roles.map((role, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => updateEditRole(idx, e.target.value)}
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="FULLSTACK DEVELOPER"
                    />
                    {editForm.roles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEditRole(idx)}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEditRole}
                  className="bg-accent text-secondary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 mt-2"
                >
                  + Add Role
                </button>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Description *
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Crafting innovative solutions..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Texto Boton Primario *
                </label>
                <input
                  type="text"
                  value={editForm.primaryButtonText ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, primaryButtonText: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Acceso Personal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  URL Boton Primario *
                </label>
                <input
                  type="text"
                  value={editForm.primaryButtonUrl ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, primaryButtonUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="/auth/login"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Texto Boton Secundario *
                </label>
                <input
                  type="text"
                  value={editForm.secondaryButtonText ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, secondaryButtonText: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Newsletter Clientes"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  URL Boton Secundario *
                </label>
                <input
                  type="text"
                  value={editForm.secondaryButtonUrl ?? ''}
                  onChange={(e) => setEditForm({ ...editForm, secondaryButtonUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="/newsletter/subscribe"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">
                  Hero Image
                </label>
                <button
                  type="button"
                  onClick={openSavedImagesModal}
                  className="mb-3 bg-primary hover:bg-primary/80 text-primary-content border border-border px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Seleccionar imagenes guardadas
                </button>
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
                      alt="Preview"
                      className="max-w-xs max-h-48 rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="bg-accent hover:bg-accent/80 disabled:opacity-50 text-secondary px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  {saving ? 'Saving...' : uploadingImage ? 'Uploading...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Cancel
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
              <div className="space-y-6">
                {groupedStoredImages.map((group) => (
                  <div key={group.section}>
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-neutral">{group.section}</h4>
                      <span className="text-xs text-tertiary-content">{group.images.length} imagen(es)</span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {group.images.map((image) => {
                        const extraSections = (imageUsageById[image.id] || []).filter(
                          (section) => section !== group.section
                        )

                        return (
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
                            <div className="text-xs text-tertiary-content mb-1">
                              {formatBytes(image.size)}
                            </div>
                            {extraSections.length > 0 && (
                              <div className="text-xs text-tertiary-content mb-3">
                                Tambien en: {extraSections.join(', ')}
                              </div>
                            )}
                            {extraSections.length === 0 && <div className="mb-3" />}
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
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
