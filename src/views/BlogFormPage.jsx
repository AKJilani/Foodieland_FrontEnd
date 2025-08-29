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
  const [featured_image, setImage] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [cats, setCats] = useState([])

  const [tab, setTab] = useState('write') // 'write' | 'preview'
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

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
        setImage(b?.featured_image || '')
        setContent(b?.content || '')
        setCategory(b?.category || '')
      })
    }

    return () => { mounted = false }
  }, [isEdit, id])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        title,
        description,
        content,
        featured_image,
        is_published: true,
        ...(category ? { category } : {})
      }
      console.log('Submitting payload:', payload)
      if (isEdit) {
        await updateBlog(id, payload)
        navigate(`/blogs/${id}`)
      } else {
        const b = await createBlog(payload)
        navigate(`/blogs/${b.id}`)
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
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="p-6 sm:p-8">
          <h2 className="text-3xl font-semibold text-gray-900">
            {isEdit ? 'Edit Blog' : 'Add Blog'}
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Title</label>
              <input
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Your amazing title…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Featured image */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Featured image URL</label>
              <input
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="https://…"
                value={featured_image}
                onChange={(e) => setImage(e.target.value)}
              />
              {featured_image ? (
                <div className="pt-2">
                  <img
                    src={featured_image}
                    alt="Featured preview"
                    className="w-full h-44 object-cover rounded-xl border border-gray-200"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
              ) : null}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Short description</label>
              <textarea
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows={3}
                placeholder="One or two lines to hook the reader…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Category</label>
              <select
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">No category</option>
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Markdown content */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Content (Markdown supported)</label>
                <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setTab('write')}
                    className={`px-3 py-1.5 text-sm ${tab === 'write' ? 'bg-zinc-600 text-white' : 'bg-white text-gray-700'}`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('preview')}
                    className={`px-3 py-1.5 text-sm ${tab === 'preview' ? 'bg-zinc-600 text-white' : 'bg-white text-gray-700'}`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {tab === 'write' ? (
                <textarea
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows={14}
                  placeholder="# Heading 1
Write your blog in **Markdown**"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              ) : (
                <div className="prose max-w-none border border-gray-200 rounded-xl p-4 bg-gray-50 overflow-x-auto">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content || '*Nothing to preview yet… start typing in **Write** tab.*'}
                  </ReactMarkdown>
                </div>
              )}

              <p className="text-xs text-gray-500">
                Supports **bold**, _italics_, `code`, lists, tables and more (GFM).
              </p>
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
    </div>
  )
}
