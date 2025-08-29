import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBlog, incrementBlogView, listComments, createComment } from '../api/blogs'
import BlogSidebar from '../components/BlogSidebar'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

export default function BlogDetailsPage() {
  const { id } = useParams()
  const { data: blog } = useQuery({ queryKey: ['blog', id], queryFn: () => getBlog(id) })
  const { data: comments } = useQuery({ queryKey: ['blog-comments', id], queryFn: () => listComments(id) })
  useEffect(() => { if (id) incrementBlogView(id) }, [id])
  const [content, setContent] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    await createComment({ blog: id, content })
    setContent('')
    window.location.reload()
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      {/* Title */}
      <motion.h1
        className="text-4xl font-bold text-gray-900 leading-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {blog?.title || '...'}
      </motion.h1>

      {/* Author + Date */}
      <motion.div
        className="flex items-center gap-4 text-sm text-gray-500 mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center content-between"><span className="flex items-center">
          {blog?.author?.profile_picture ? (
            <img
              src={blog.author.profile_picture}
              alt={blog?.author_name || 'Unknown'}
              className="w-6 h-6 rounded-full object-cover inline-block mr-2"
            />
          ) : (
            <span className="w-6 h-6 rounded-full bg-slate-400 text-slate-50 flex items-center justify-center font-bold inline-block mr-2">
              {blog?.author_name ? blog.author_name.charAt(0).toUpperCase() : "?"}
            </span>
          )}
          <span className="font-medium capitalize text-gray-700">{blog?.author_name || 'Unknown'}</span>
        </span>
        </div>
        <span>•</span>
        <span>{blog?.created_at ? new Date(blog.created_at).toDateString() : ''}</span>
      </motion.div>

      {/* Short Description */}
      {blog?.description && (
        <motion.p
          className="mt-4 text-lg text-gray-600 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {blog.description}
        </motion.p>
      )}

      {/* Featured Image */}
      {blog?.featured_image && (
        <motion.img
          src={blog.featured_image}
          alt={blog.title}
          className="md:w-5/6 h-96 object-cover rounded-2xl shadow-md mx-auto md:mx-0 mt-6 "
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        />
      )}

      {/* Content + Sidebar */}
      <div className="grid md:grid-cols-3 gap-10 mt-10">
        {/* Blog Content */}
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog?.content || ""}
            </ReactMarkdown>
          </div>

          {/* Comments Section */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Comments</h3>

            {/* Comment List */}
            <div className="space-y-4">
              {comments?.results?.map(c => (
                <motion.div
                  key={c.id}
                  className="bg-white border rounded-xl p-4 shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm capitalize font-semibold text-gray-600">{c.user}</div>
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(c.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short'
                      })}
                    </div>
                  </div>
                  <p className="text-gray-500 mt-1">{c.content}</p>
                </motion.div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mt-6 flex items-center gap-3">
              <input
                className="flex-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Write a comment..."
                value={content}
                onChange={e => setContent(e.target.value)}
                required
              />
              <button className="px-5 py-2 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-700 transition">
                Post
              </button>
            </form>
          </motion.div>
        </motion.div>

        {/* Sidebar (starts a bit lower) */}
        <motion.div
          className="mt-8 md:mt-0"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <BlogSidebar />
        </motion.div>
      </div>
    </section>
  )
}
