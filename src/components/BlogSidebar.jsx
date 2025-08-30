import { useQuery } from '@tanstack/react-query'
import { listBlogs } from '../api/blogs'
import { Link } from 'react-router-dom'

export default function BlogSidebar() {
  // Top 3 recent blogs (changed from 10 to 3)
  const { data: recentPosts } = useQuery({
    queryKey: ['recent-blogs'],
    queryFn: () => listBlogs({ ordering: '-created_at', limit: 3 })
  })

  return (
    <aside className="space-y-8">
      {/* Recent Posts Section */}
      {recentPosts?.results?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-green-600 font-bold">📅</span>
            <h4 className="text-xl font-bold text-gray-900">Recent Posts</h4>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {recentPosts.results.map(post => (
              <Link
                key={post.id}
                to={`/blogs/${post.id}`}
                className="group flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5 border border-transparent hover:border-gray-200"
              >
                {/* Enhanced Thumbnail - MADE BIGGER */}
                <div className="w-24 h-18 flex-shrink-0 relative overflow-hidden rounded-lg">
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 to-purple-300 flex items-center justify-center">
                      <span className="text-white font-bold text-base">
                        {post.title?.charAt(0) || 'B'}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg" />
                </div>

                {/* Enhanced Content Info */}
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors leading-tight mb-2 line-clamp-2">
                    {post.title}
                  </h5>
                  
                  {post.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {post.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <span>👤</span>
                      <span className="truncate max-w-20">
                        {post.author_name || 'Anonymous'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📅</span>
                      <span>
                        {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        }) : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="flex-shrink-0 self-start mt-1">
                  <span className="text-gray-400 group-hover:text-blue-600 transition-colors">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}