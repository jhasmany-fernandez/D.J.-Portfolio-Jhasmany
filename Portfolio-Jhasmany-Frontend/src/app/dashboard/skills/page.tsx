'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/useToast'

interface Skill {
  id: string
  name: string
  icon: string
  imageUrl?: string
  order: number
  isPublished: boolean
  createdAt?: string
  updatedAt?: string
}

export default function SkillsPage() {
  const toast = useToast()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState<Partial<Skill>>({
    name: '',
    icon: '📦', // Default icon for skills
    imageUrl: '',
    order: 1,
    isPublished: true
  })
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [editForm, setEditForm] = useState<Skill | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Fetch skills
  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setSkills(data.skills || [])
      setError(null)
    } catch (error) {
      console.error('Error fetching skills:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
      setSkills([])
    } finally {
      setLoading(false)
    }
  }

  // Delete skill
  const deleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchSkills()
        toast.success('Skill deleted successfully')
      } else {
        toast.error('Error deleting skill')
      }
    } catch (error) {
      console.error('Error deleting skill:', error)
      toast.error('Error deleting skill')
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

  // Upload image to backend via Next.js API proxy
  const uploadImage = async () => {
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
        toast.success('Image uploaded successfully')
        return result.url
      } else {
        let errorMessage = `Upload failed with status ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
          console.error('Upload error:', response.status, errorData)
        } catch (e) {
          // Response is not JSON, try to get text
          const errorText = await response.text()
          console.error('Upload error (non-JSON):', response.status, errorText)
          errorMessage = errorText || errorMessage
        }
        toast.error(`Error uploading image: ${errorMessage}`)
        return null
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error(`Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  // Start editing skill
  const startEditing = (skill: Skill) => {
    setEditingSkill(skill)
    setEditForm({ ...skill })
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingSkill(null)
    setEditForm(null)
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  // Update form field
  const updateFormField = (field: keyof Skill, value: string | number | boolean) => {
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
      name: '',
      icon: '📦', // Default icon for skills
      imageUrl: '',
      order: 1,
      isPublished: true
    })
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  // Create new skill
  const createSkill = async () => {
    if (!createForm.name?.trim()) {
      toast.error('Name is required')
      return
    }

    setSaving(true)
    try {
      let imageUrl = ''

      // Upload image first if a file was selected
      if (selectedFile) {
        imageUrl = await uploadImage()
        if (!imageUrl) {
          toast.error('Error uploading image. Please try again.')
          setSaving(false)
          return
        }
      }

      // Prepare skill data
      const skillData = {
        ...createForm,
        imageUrl: imageUrl || createForm.imageUrl || ''
      }

      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(skillData)
      })

      if (response.ok) {
        await fetchSkills()
        setShowCreateForm(false)
        resetCreateForm()
        toast.success('Skill created successfully')
      } else {
        toast.error('Error creating skill')
      }
    } catch (error) {
      console.error('Error creating skill:', error)
      toast.error('Error creating skill')
    } finally {
      setSaving(false)
    }
  }

  // Save skill changes
  const saveSkill = async () => {
    if (!editForm || !editingSkill) return

    if (!editForm.name?.trim()) {
      toast.error('Name is required')
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

      console.log('[Skills Page] Updating skill:', editingSkill.id, 'Data:', updateData)

      const response = await fetch(`/api/skills/${editingSkill.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      console.log('[Skills Page] Response status:', response.status)

      if (response.ok) {
        await fetchSkills()
        cancelEditing()
        toast.success('Skill updated successfully')
      } else {
        let errorMessage = 'Error updating skill'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
          console.error('[Skills Page] Update error:', response.status, errorData)
        } catch (e) {
          const errorText = await response.text()
          console.error('[Skills Page] Update error (non-JSON):', response.status, errorText)
          errorMessage = errorText || errorMessage
        }
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Error updating skill:', error)
      toast.error('Error updating skill')
    } finally {
      setSaving(false)
    }
  }

  // Toggle published status
  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isPublished: !currentStatus })
      })

      if (response.ok) {
        await fetchSkills()
        toast.success(`Skill ${!currentStatus ? 'published' : 'unpublished'} successfully`)
      } else {
        toast.error('Error changing publication status')
      }
    } catch (error) {
      console.error('Error toggling published status:', error)
      toast.error('Error changing publication status')
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral mb-2">Skills Management</h1>
          <p className="text-tertiary-content">Loading skills...</p>
        </div>
        <div className="flex justify-center py-12">
          <div className="text-accent text-2xl">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral mb-2">Skills Management</h1>
          <p className="text-tertiary-content">Error loading skills</p>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
        <button
          onClick={fetchSkills}
          className="bg-accent hover:bg-accent/80 text-secondary px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral mb-2">Skills Management</h1>
        <p className="text-tertiary-content">Manage all the skills in your portfolio</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-accent hover:bg-accent/80 text-secondary px-4 py-2 rounded-lg transition-colors duration-200"
        >
          + New Skill
        </button>
      </div>

      {/* Skills Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-secondary border-border rounded-lg border p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">
                  {skill.icon || ''}
                </div>
                {skill.imageUrl && (
                  <img
                    src={skill.imageUrl}
                    alt={skill.name}
                    className="w-12 h-12 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-accent/20 text-accent px-2 py-1 rounded-full text-xs">
                  Order {skill.order}
                </span>
                <button
                  onClick={() => togglePublished(skill.id, skill.isPublished)}
                  className={`px-2 py-1 rounded-full text-xs transition-colors duration-200 ${
                    skill.isPublished
                      ? 'bg-green-500/20 text-green-700 hover:bg-green-500/30'
                      : 'bg-gray-500/20 text-gray-700 hover:bg-gray-500/30'
                  }`}
                  title={skill.isPublished ? 'Published - Click to unpublish' : 'Unpublished - Click to publish'}
                >
                  {skill.isPublished ? '✓ Published' : '✗ Private'}
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-neutral mb-4 truncate" title={skill.name}>
              {skill.name}
            </h3>

            <div className="flex gap-2">
              <button
                onClick={() => startEditing(skill)}
                className="bg-accent hover:bg-accent/80 text-secondary px-3 py-1 rounded text-sm transition-colors duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => deleteSkill(skill.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="bg-secondary border-border rounded-lg border p-12 text-center">
          <div className="text-6xl mb-4"></div>
          <h3 className="text-xl font-semibold text-neutral mb-2">No skills yet</h3>
          <p className="text-tertiary-content mb-6">
            Start by creating your first skill to showcase in your portfolio.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-accent hover:bg-accent/80 text-secondary px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Create First Skill
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="bg-secondary border-border rounded-lg border p-6">
        <h3 className="text-xl font-semibold text-neutral mb-4">Skills Statistics</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{skills.length}</div>
            <div className="text-sm text-tertiary-content">Total Skills</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {skills.filter(s => s.isPublished).length}
            </div>
            <div className="text-sm text-tertiary-content">Published</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {skills.filter(s => !s.isPublished).length}
            </div>
            <div className="text-sm text-tertiary-content">Private</div>
          </div>
        </div>
      </div>

      {/* Create Skill Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-secondary border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-neutral mb-4">Create New Skill</h3>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); createSkill(); }}>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  value={createForm.name ?? ''}
                  onChange={(e) => updateCreateFormField('name', e.target.value)}
                  placeholder="e.g: React, Python, UI Design"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Order *
                </label>
                <input
                  type="number"
                  value={createForm.order ?? 1}
                  onChange={(e) => updateCreateFormField('order', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">
                  Skill Image (optional)
                </label>
                <div className="mb-3">
                  <label className="block text-sm text-tertiary-content mb-2">
                    Upload image:
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
                <p className="text-xs text-tertiary-content">
                  The image will be displayed in the skills carousel
                </p>
              </div>

              {/* Published Status */}
              <div className="bg-primary border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="createIsPublished"
                    checked={createForm.isPublished ?? false}
                    onChange={(e) => updateCreateFormField('isPublished', e.target.checked)}
                    className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent focus:ring-2"
                  />
                  <label htmlFor="createIsPublished" className="text-sm font-medium text-neutral">
                    Publish skill
                  </label>
                </div>
                <p className="text-xs text-tertiary-content mt-1 ml-7">
                  {createForm.isPublished
                    ? "✅ The skill will be visible in your public portfolio"
                    : "❌ The skill will only be visible in the dashboard"
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
                  {saving ? 'Creating...' : 'Create Skill'}
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

      {/* Edit Skill Form */}
      {editingSkill && editForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-secondary border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-neutral mb-4">Edit Skill</h3>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveSkill(); }}>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  value={editForm.name ?? ''}
                  onChange={(e) => updateFormField('name', e.target.value)}
                  placeholder="e.g: React, Python, UI Design"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-1">
                  Order *
                </label>
                <input
                  type="number"
                  value={editForm.order ?? 1}
                  onChange={(e) => updateFormField('order', parseInt(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-primary text-neutral focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral mb-2">
                  Skill Image (optional)
                </label>
                <div className="mb-3">
                  <label className="block text-sm text-tertiary-content mb-2">
                    Upload new image:
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
                {/* Show current image if exists */}
                {editForm.imageUrl && !selectedFile && (
                  <div className="mb-3">
                    <label className="block text-sm text-tertiary-content mb-2">
                      Current image:
                    </label>
                    <div className="mt-2">
                      <img
                        src={editForm.imageUrl}
                        alt="Current"
                        className="max-w-xs max-h-48 rounded-lg border border-border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}
                <p className="text-xs text-tertiary-content">
                  The image will be displayed in the skills carousel
                </p>
              </div>

              {/* Published Status */}
              <div className="bg-primary border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="editIsPublished"
                    checked={editForm.isPublished ?? false}
                    onChange={(e) => updateFormField('isPublished', e.target.checked)}
                    className="w-4 h-4 text-accent bg-secondary border-border rounded focus:ring-accent focus:ring-2"
                  />
                  <label htmlFor="editIsPublished" className="text-sm font-medium text-neutral">
                    Publish skill
                  </label>
                </div>
                <p className="text-xs text-tertiary-content mt-1 ml-7">
                  {editForm.isPublished
                    ? "✅ The skill will be visible in your public portfolio"
                    : "❌ The skill will only be visible in the dashboard"
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
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Cancel
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
