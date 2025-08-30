import { useParams } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBlog, incrementBlogView, listComments, createComment } from '../api/blogs'
import { listRecipes, listCategories } from '../api/recipes'
import BlogSidebar from '../components/BlogSidebar'
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import Newsletter from '../components/Newsletter'
import RecipeCard from '../components/RecipeCard'

export default function BlogDetailsPage() {
	const { id } = useParams()
	const { data: blog } = useQuery({ queryKey: ['blog', id], queryFn: () => getBlog(id) })
	const { data: comments } = useQuery({ queryKey: ['blog-comments', id], queryFn: () => listComments(id) })
	const { data: related } = useQuery({ queryKey: ['related', id], queryFn: () => listRecipes({ ordering: '-created_at' }) })
	const [content, setContent] = useState('')

	// ADD THESE LINES:
	const { data: cats } = useQuery({
		queryKey: ['recipe-cats'],
		queryFn: listCategories
	});

	const categoryMap = useMemo(() => {
		const map = new Map();
		cats?.results?.forEach(cat => {
			map.set(cat.id, cat.name);
		});
		return map;
	}, [cats]);

	useEffect(() => { if (id) incrementBlogView(id) }, [id])

	async function handleSubmit(e) {
		e.preventDefault()
		await createComment({ blog: id, content })
		setContent('')
		window.location.reload()
	}

	return (
		<>
			<section className="max-w-7xl mx-auto px-4 py-12 space-y-10">
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
					<div className="flex items-center content-between">
						<span className="flex items-center">
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

				{/* Top Section: Featured Image + Sidebar */}
				{blog?.featured_image && (
					<div className="flex flex-col md:flex-row gap-20">
						{/* Featured Image */}
						<motion.img
							src={blog.featured_image}
							alt={blog.title}
							className="w-full md:w-2/3 h-auto object-cover rounded-2xl shadow-md self-start"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.7, delay: 0.3 }}
						/>

						{/* Sidebar */}
						<motion.div
							className="w-full md:w-1/3"
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.5 }}
						>
							<BlogSidebar />
						</motion.div>
					</div>
				)}

				{/* Blog Content + Comments */}
				<motion.div
					className="prose max-w-none mt-10"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<ReactMarkdown remarkPlugins={[remarkGfm]}>
						{blog?.content || ""}
					</ReactMarkdown>

					{/* Comments Section */}
					<motion.div
						className="mt-12 max-w-3xl"
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
			</section>
			<Newsletter />
			{/* Related Recipes */}
			<section className="max-w-7xl mx-auto px-4 py-12">
				<h3 className="text-2xl font-bold mb-6">🍲 You may also like</h3>
				<div className="flex gap-6 overflow-x-auto pb-2">
					{related?.results?.slice(0, 12)?.map(r => (
						<div key={r.id} className="w-64 flex-shrink-0">
							<RecipeCard {...r} category={categoryMap.get(r.category)} />
						</div>
					))}
				</div>
			</section>
		</>
	)
}
