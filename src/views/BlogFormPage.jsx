import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createBlog, getBlog, updateBlog, deleteBlog, listBlogCategories } from '../api/blogs'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function BlogFormPage({ mode }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = mode === 'edit'

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [cats, setCats] = useState([])

  const [tab, setTab] = useState('write') // 'write' | 'preview'
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [imageFile, setImageFile] = useState(null) // For file upload
  const [imagePreview, setImagePreview] = useState('') // Preview

  useEffect(() => {
    let mounted = true
    listBlogCategories().then((d) => {
      if (mounted) setCats(d?.results || [])
    })

    if (isEdit && id) {
      getBlog(id).then((b) => {
        if (!mounted) return
        setTitle(b?.title || '')
        setDescription(b?.description || '')
        setContent(b?.content || '')
        setCategory(b?.category || '')
        setImagePreview(b?.featured_image || '')
      })
    }

    return () => { mounted = false }
  }, [isEdit, id])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('content', content)
      formData.append('category', category || '')
      if (imageFile) formData.append('featured_image', imageFile)

      if (isEdit) {
        await updateBlog(id, formData, true)
        navigate(`/blogs/${id}/`)
      } else {
        const b = await createBlog(formData, true)
        navigate(`/blogs/${b.id}/`)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!isEdit || !id) return
    if (confirm('Delete this blog?')) {
      setDeleting(true)
      try {
        await deleteBlog(id)
        navigate('/blogs')
      } finally {
        setDeleting(false)
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">{isEdit ? 'Edit Blog' : 'Add Blog'}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <input
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Your amazing title…"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0]
                setImageFile(file)
                setImagePreview(URL.createObjectURL(file))
              }}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-full h-44 object-cover rounded-xl border border-gray-200"
              />
            )}
          </div>

          {/* Description */}
          <textarea
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={3}
            placeholder="Short description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          {/* Category */}
          <select
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">No category</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {/* Markdown Content */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Content (Markdown supported)</label>
              <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setTab('write')}
                  className={`px-3 py-1.5 text-sm ${tab === 'write' ? 'bg-zinc-600 text-white' : 'bg-white text-gray-700'}`}
                >Write</button>
                <button
                  type="button"
                  onClick={() => setTab('preview')}
                  className={`px-3 py-1.5 text-sm ${tab === 'preview' ? 'bg-zinc-600 text-white' : 'bg-white text-gray-700'}`}
                >Preview</button>
              </div>
            </div>

            {tab === 'write' ? (
              <textarea
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows={14}
                placeholder="# Heading 1\nWrite your blog in **Markdown**"
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            ) : (
              <div className="prose max-w-none border border-gray-200 rounded-xl p-4 bg-gray-50 overflow-x-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || '*Nothing to preview yet… start typing in **Write** tab.*'}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-zinc-900 hover:bg-gray-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl shadow-sm transition"
            >
              {saving ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save Changes' : 'Create Blog')}
            </button>

            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-3 rounded-xl border border-red-500 text-red-600 hover:bg-red-50 disabled:opacity-60 transition"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}