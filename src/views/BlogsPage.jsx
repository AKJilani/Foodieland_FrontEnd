import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { listBlogCategories, listBlogs, deleteBlog } from '../api/blogs'
import { getAccessToken } from '../api/client'
import { fetchMe } from '../api/auth'
import Pagination from '../components/Pagination'
import { motion } from "framer-motion"

export default function BlogsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [ordering, setOrdering] = useState('-created_at')
  const [params, setParams] = useSearchParams()
  const [selectedCat, setSelectedCat] = useState(params.get('category') || '')
  const navigate = useNavigate()

  const { data, refetch } = useQuery({
    queryKey: ['blogs', { page, search, ordering }],
    queryFn: () => listBlogs({ page, search, ordering })
  })

  const { data: cats } = useQuery({ queryKey: ['blog-cats'], queryFn: listBlogCategories })

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    enabled: Boolean(getAccessToken()) // only fetch if logged in
  })

  useEffect(() => { setPage(1); refetch() }, [search, ordering])
  useEffect(() => {
    setParams(p => {
      selectedCat ? p.set('category', selectedCat) : p.delete('category');
      return p
    })
  }, [selectedCat])

  const filteredResults = useMemo(() => {
    if (!selectedCat) return data?.results || []
    return (data?.results || []).filter(b => b.category === selectedCat)
  }, [data, selectedCat])

  async function handleDelete(blogId) {
    if (!window.confirm("Are you sure you want to delete this blog?")) return
    try {
      await deleteBlog(blogId)
      refetch()
    } catch (err) {
      console.error(err)
      alert("Failed to delete blog.")
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight">Blogs</h2>
        <div className="flex gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search blogs..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-72 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition"
          />
          <select
            value={ordering}
            onChange={e => setOrdering(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition"
          >
            <option value="-created_at">Newest</option>
          </select>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.01 } }
        }}
      >
        <motion.button
          onClick={() => setSelectedCat('')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            selectedCat === ''
              ? 'bg-gray-900 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
        >
          All
        </motion.button>
        {cats?.results?.map(c => (
          <motion.button
            key={c.id}
            onClick={() => setSelectedCat(c.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              selectedCat === c.id
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          >
            {c.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Blog Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.001 } }
        }}
      >
        {filteredResults.map(b => (
          <motion.article
            key={b.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.08 }}
          >
            {b.featured_image && (
              <motion.img
                src={b.featured_image}
                alt={b.title}
                className="w-full h-48 object-cover transform transition duration-300 hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
            )}
<div className="p-5 flex flex-col h-full">
  <div>
    <h3 className="text-lg font-semibold line-clamp-1 text-gray-900">
      {b.title}
    </h3>
    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
      {b.description}
    </p>
    <a
      href={`/blogs/${b.id}`}
      className="inline-flex items-center text-sm font-medium text-gray-900 mt-3 hover:underline"
    >
      Read more →
    </a>
  </div>

  {/* Author + Edit/Delete */}
  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
    {/* Author */}
    <div className="flex items-center">
      <span className="w-6 h-6 rounded-full bg-slate-400 text-slate-50 flex items-center justify-center font-bold inline-block mr-2">
              {b.author_name ? b.author_name.charAt(0).toUpperCase() : "?"}
            </span>
      <span className="text-sm font capitalize font-medium text-gray-600">{b.author_name}</span>
    </div>

    {/* Edit/Delete icons (only if user == author) */}
    {getAccessToken() && currentUser?.id === b.author && (
      <div className="text-gray-500 flex items-center gap-2">
        <button
          onClick={() => navigate(`/blogs/${b.id}/edit`)}
          className="hover:text-gray-700 mt-1 w-6 h-6"
          title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
            fill="none" viewBox="0 0 24 24" 
            strokeWidth={1.5} stroke="currentColor" 
            className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652l-9.193 9.193a4.5 4.5 0 01-1.897 1.13L6 16.5l.726-4.111a4.5 4.5 0 011.13-1.897l9.006-9.005z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.5L16.5 4.5" />
          </svg>
        </button>

        <button
            onClick={() => handleDelete(b.id)}
            className="text-red-500 hover:text-red-700 w-6 h-6"
            title="Delete"
          >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>


          </button>
                </div>
              )}
            </div>
          </div>

          </motion.article>
        ))}
      </motion.div>

      {/* Add Blog Button */}
      {getAccessToken() && (
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="/blogs/new"
            className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-gray-800 transition"
          >
            + Add Blog
          </a>
        </motion.div>
      )}

      {/* Pagination */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Pagination
          page={page}
          setPage={setPage}
          hasNext={Boolean(data?.next)}
          hasPrev={Boolean(data?.previous)}
        />
      </motion.div>
    </section>
  )
}
