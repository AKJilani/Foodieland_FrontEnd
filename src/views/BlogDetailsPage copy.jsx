import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBlog, incrementBlogView, listComments, createComment } from '../api/blogs'
import BlogSidebar from '../components/BlogSidebar'
import { useState } from 'react'

export default function BlogDetailsPage() {
	const { id } = useParams()
	const { data: blog } = useQuery({ queryKey: ['blog', id], queryFn: ()=>getBlog(id) })
	const { data: comments } = useQuery({ queryKey: ['blog-comments', id], queryFn: ()=>listComments(id) })
	useEffect(()=>{ if(id) incrementBlogView(id) }, [id])
	const [content, setContent] = useState('')

	async function handleSubmit(e){
		e.preventDefault()
		await createComment({ blog: id, content })
		setContent('')
		window.location.reload()
	}
	return (
		<>
			<section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10">
				<div className="md:col-span-2">
					{blog?.featured_image && <img src={blog.featured_image} alt={blog.title} className="w-full h-72 object-cover rounded" />}
					<h1 className="text-3xl font-bold mt-6">{blog?.title || '...'}</h1>
					<div className="text-sm text-gray-600 mt-1">by {blog?.author_name || 'Unknown'}</div>
					<div className="prose max-w-none mt-6">{blog?.content}</div>
					<div className="mt-10">
						<h3 className="font-semibold mb-2">Comments</h3>
						<div className="space-y-3">
							{comments?.results?.map(c => (
								<div key={c.id} className="border rounded p-3">
									<div className="text-sm text-gray-600">{c.user}</div>
									<div className="text-gray-800">{c.content}</div>
								</div>
							))}
						</div>
						<form onSubmit={handleSubmit} className="mt-4 flex gap-2">
							<input className="flex-1 border rounded px-3 py-2" placeholder="Write a comment..." value={content} onChange={e=>setContent(e.target.value)} required />
							<button className="px-4 py-2 bg-gray-900 text-white rounded">Post</button>
						</form>
					</div>
				</div>
				<div>
					<BlogSidebar />
				</div>
			</section>
		</>
	)
}


