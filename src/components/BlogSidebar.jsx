import { useQuery } from '@tanstack/react-query'
import { listBlogs, listBlogCategories } from '../api/blogs'

export default function BlogSidebar() {
  const { data: recent } = useQuery({
    queryKey: ['blogs', { page: 1, ordering: '-created_at' }],
    queryFn: () => listBlogs({ page: 1, ordering: '-created_at' }),
  })
  const { data: cats } = useQuery({
    queryKey: ['blog-cats'],
    queryFn: listBlogCategories,
  })

  return (
    <aside className="space-y-8">
      {/* Recent Posts */}
      <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-4">
          Recent Posts
        </h4>
        <ul className="space-y-3 text-sm">
          {recent?.results?.slice(0, 5)?.map((b) => (
            <li key={b.id}>
              <a
                className="block text-gray-700 hover:text-indigo-600 hover:translate-x-1 transition-transform duration-200"
                href={`/blogs/${b.id}`}
              >
                {b.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories */}
      <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-4">
          Categories
        </h4>
        <ul className="space-y-2 text-sm">
          {cats?.results?.map((c) => (
            <li key={c.id}>
              <a
                className="flex items-center justify-between group px-3 py-2 rounded-lg hover:bg-indigo-50 transition"
                href={`/blogs?category=${c.id}`}
              >
                <span className="text-gray-700 group-hover:text-indigo-600">
                  {c.name}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-indigo-500">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}