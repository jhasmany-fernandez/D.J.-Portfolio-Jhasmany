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

  // Add role
  const addRole = () => {
    if (editForm) {
      setEditForm({
        ...editForm,
        roles: [...editForm.roles, '']
      })
    }
  }

  // Remove role
  const removeRole = (index: number) => {
    if (editForm) {
      const newRoles = editForm.roles.filter((_, i) => i !== index)
      setEditForm({
        ...editForm,
        roles: newRoles
      })
    }
  }

  // Update role
  const updateRole = (index: number, value: string) => {
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

  const activeSection = homeSections.find(s => s.isActive)

  return (
    <div className="p-6">
      <toast.ToastContainer />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral mb-2">Home Section</h1>
        <p className="text-tertiary-content">Manage your hero section content</p>
      </div>

      {activeSection && (
        <div className="bg-secondary border border-border rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-accent text-sm font-medium">ACTIVE SECTION</span>
              <h2 className="text-xl font-bold text-neutral mt-1">{activeSection.greeting}</h2>
            </div>
            <button
              onClick={() => startEditing(activeSection)}
              className="bg-accent text-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
            >
              Edit
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-tertiary-content text-sm">Roles:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {activeSection.roles.map((role, idx) => (
                  <span key={idx} className="bg-primary border border-border px-3 py-1 rounded text-sm text-neutral">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-tertiary-content text-sm">Description:</span>
              <p className="text-neutral mt-1">{activeSection.description}</p>
            </div>

            {activeSection.imageUrl && (
              <div>
                <span className="text-tertiary-content text-sm">Image:</span>
                <img
                  src={activeSection.imageUrl}
                  alt="Hero"
                  className="mt-2 h-32 w-32 object-cover rounded-lg border border-border"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingSection && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-secondary border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-neutral mb-6">Edit Home Section</h2>

              <div className="space-y-4">
                {/* Greeting */}
                <div>
                  <label className="block text-sm font-medium text-neutral mb-2">
                    Greeting
                  </label>
                  <input
                    type="text"
                    value={editForm.greeting}
                    onChange={(e) => setEditForm({ ...editForm, greeting: e.target.value })}
                    className="w-full bg-primary border border-border rounded-lg px-4 py-2 text-neutral"
                    placeholder="Hi - I'm Your Name"
                  />
                </div>

                {/* Roles */}
                <div>
                  <label className="block text-sm font-medium text-neutral mb-2">
                    Roles (will rotate automatically)
                  </label>
                  {editForm.roles.map((role, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => updateRole(idx, e.target.value)}
                        className="flex-1 bg-primary border border-border rounded-lg px-4 py-2 text-neutral"
                        placeholder="FULLSTACK DEVELOPER"
                      />
                      <button
                        onClick={() => removeRole(idx)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addRole}
                    className="bg-accent text-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 mt-2"
                  >
                    + Add Role
                  </button>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-neutral mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="w-full bg-primary border border-border rounded-lg px-4 py-2 text-neutral"
                    placeholder="Crafting innovative solutions..."
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
                    className="w-full bg-primary border border-border rounded-lg px-4 py-2 text-neutral"
                  />
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mt-3 h-32 w-32 object-cover rounded-lg border border-border"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={cancelEditing}
                  disabled={saving}
                  className="bg-primary border border-border text-neutral px-6 py-2 rounded-lg hover:bg-opacity-80"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSection}
                  disabled={saving || uploadingImage}
                  className="bg-accent text-primary px-6 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : uploadingImage ? 'Uploading...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
