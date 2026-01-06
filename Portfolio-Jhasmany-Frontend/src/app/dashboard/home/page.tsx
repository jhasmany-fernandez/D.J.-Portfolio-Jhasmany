'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'

interface HomeSection {
  id: string
  greeting: string
  roles: string[]
  description: string
  imageUrl?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

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
    isActive: false
  })
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

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

  return (
    <div className="p-6 max-w-7xl">
      <toast.ToastContainer />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral mb-2">Home Sections</h1>
        <p className="text-tertiary-content">Manage your hero section content. Only one section can be active at a time.</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-accent hover:bg-accent/80 text-secondary px-4 py-2 rounded-lg transition-colors duration-200"
        >
          + New Home Section
        </button>
      </div>

      {/* Home Sections Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {homeSections.map((section) => (
          <div key={section.id} className="bg-secondary border-border rounded-lg border p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col">
            {/* Image */}
            {section.imageUrl && (
              <div className="mb-4">
                <img
                  src={section.imageUrl}
                  alt="Hero"
                  className="w-full h-32 object-cover rounded-lg border border-border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}

            {/* Greeting */}
            <h3 className="text-lg font-semibold text-neutral mb-2 truncate" title={section.greeting}>
              {section.greeting}
            </h3>

            {/* Roles */}
            <div className="mb-3">
              <span className="text-tertiary-content text-xs">Roles:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {section.roles.map((role, idx) => (
                  <span key={idx} className="bg-primary border border-border px-2 py-1 rounded text-xs text-neutral">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-tertiary-content text-sm mb-4 line-clamp-2" title={section.description}>
              {section.description}
            </p>

            {/* Status Badge */}
            <div className="mb-4">
              {section.isActive ? (
                <span className="bg-green-500/20 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  ✓ Active
                </span>
              ) : (
                <button
                  onClick={() => setActive(section.id)}
                  className="bg-gray-500/20 text-gray-700 hover:bg-gray-500/30 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200"
                >
                  Set as Active
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => startEditing(section)}
                className="flex-1 bg-accent hover:bg-accent/80 text-secondary px-3 py-2 rounded text-sm transition-colors duration-200 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => deleteSection(section.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors duration-200 font-medium"
                disabled={section.isActive}
                title={section.isActive ? 'Cannot delete active section' : 'Delete section'}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {homeSections.length === 0 && (
        <div className="bg-secondary border-border rounded-lg border p-12 text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-neutral mb-2">No home sections yet</h3>
          <p className="text-tertiary-content mb-6">
            Start by creating your first home section for your portfolio hero area.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-accent hover:bg-accent/80 text-secondary px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Create First Section
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="bg-secondary border-border rounded-lg border p-6 mt-6">
        <h3 className="text-xl font-semibold text-neutral mb-4">Statistics</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{homeSections.length}</div>
            <div className="text-sm text-tertiary-content">Total Sections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {homeSections.filter(s => s.isActive).length}
            </div>
            <div className="text-sm text-tertiary-content">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {homeSections.filter(s => !s.isActive).length}
            </div>
            <div className="text-sm text-tertiary-content">Inactive</div>
          </div>
        </div>
      </div>

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

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">
                  Hero Image (optional)
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

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">
                  Hero Image
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
    </div>
  )
}
