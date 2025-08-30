import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listBlogs, listBlogCategories } from '../api/blogs'
import Pagination from '../components/Pagination'
import { getAccessToken } from '../api/client'
import { useSearchParams } from 'react-router-dom'
import Newsletter from '../components/Newsletter'

export default function BlogsPage() {
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')
	const [ordering, setOrdering] = useState('-created_at')
	const [params, setParams] = useSearchParams()
	const [selectedCat, setSelectedCat] = useState(params.get('category') || '')
	
	const ITEMS_PER_PAGE = 6 // 2 rows × 3 cards
	
	// Fetch ALL blogs without pagination (remove page and limit from API call)
	const { data, isLoading, refetch } = useQuery({ 
		queryKey: ['blogs', { search, ordering }], 
		queryFn: () => listBlogs({ 
			search, 
			ordering,
			// Don't pass page or limit - get all results
		}) 
	})
	
	const { data: cats } = useQuery({ 
		queryKey: ['blog-cats'], 
		queryFn: listBlogCategories 
	})

	// Reset page when search, ordering, or category changes
	useEffect(() => { 
		setPage(1)
	}, [search, ordering, selectedCat])

	// Update URL params when category changes
	useEffect(() => { 
		setParams(p => { 
			if (selectedCat) {
				p.set('category', selectedCat)
			} else {
				p.delete('category')
			}
			return p 
		}) 
	}, [selectedCat, setParams])

	// Filter and paginate on the frontend
	const { paginatedResults, totalPages, hasNext, hasPrev } = useMemo(() => {
		let allResults = data?.results || []
		
		// Filter by category if selected
		if (selectedCat) {
			allResults = allResults.filter(b => b.category === selectedCat)
		}
		
		// Calculate pagination
		const startIndex = (page - 1) * ITEMS_PER_PAGE
		const endIndex = startIndex + ITEMS_PER_PAGE
		const paginatedResults = allResults.slice(startIndex, endIndex)
		const totalPages = Math.ceil(allResults.length / ITEMS_PER_PAGE)
		const hasNext = page < totalPages
		const hasPrev = page > 1
		
		return { paginatedResults, totalPages, hasNext, hasPrev }
	}, [data, selectedCat, page, ITEMS_PER_PAGE])

	return (
		<>
			<section className="max-w-6xl mx-auto px-4 py-12">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
					<h2 className="text-2xl font-semibold">Blogs</h2>
					<div className="flex gap-2">
						<input 
							value={search} 
							onChange={e => setSearch(e.target.value)} 
							placeholder="Search blogs..." 
							className="border rounded px-3 py-2 w-64" 
						/>
						<select 
							value={ordering} 
							onChange={e => setOrdering(e.target.value)} 
							className="border rounded px-3 py-2"
						>
							<option value="-created_at">Newest</option>
							<option value="created_at">Oldest</option>
							<option value="title">Title A-Z</option>
							<option value="-title">Title Z-A</option>
						</select>
					</div>
				</div>
				
				<div className="flex gap-2 overflow-x-auto pb-2 mb-6">
					<button 
						onClick={() => setSelectedCat('')} 
						className={`px-3 py-1 border rounded whitespace-nowrap ${
							selectedCat === '' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
						}`}
					>
						All
					</button>
					{cats?.results?.map(c => (
						<button 
							key={c.id} 
							onClick={() => setSelectedCat(c.id)} 
							className={`px-3 py-1 border rounded whitespace-nowrap ${
								selectedCat === c.id ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
							}`}
						>
							{c.name}
						</button>
					))}
				</div>
				
				{/* Show current page info for debugging */}
				<div className="text-sm text-gray-500 mb-4">
					Page {page} of {totalPages} • Showing {paginatedResults.length} of {selectedCat ? 
						((data?.results || []).filter(b => b.category === selectedCat).length) : 
						(data?.results?.length || 0)} blogs
				</div>
				
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{paginatedResults.map(b => (
						<article key={b.id} className="border rounded overflow-hidden hover:shadow-md transition-shadow">
							{b.featured_image && (
								<img 
									src={b.featured_image} 
									alt={b.title} 
									className="w-full h-48 object-cover" 
								/>
							)}
							<div className="p-4">
								<h3 className="text-lg font-semibold line-clamp-1">{b.title}</h3>
								<p className="text-sm text-gray-600 line-clamp-2 mt-1">{b.description}</p>
								<a 
									href={`/blogs/${b.id}`} 
									className="text-sm text-gray-900 mt-2 inline-block hover:underline"
								>
									Read more →
								</a>
							</div>
						</article>
					))}
				</div>
				
				{paginatedResults.length === 0 && !isLoading && (
					<div className="text-center py-12">
						<p className="text-gray-500">
							{search || selectedCat ? 'No blogs found matching your criteria.' : 'No blogs found.'}
						</p>
					</div>
				)}
				
				{getAccessToken() && (
					<div className="mt-6">
						<a 
							href="/blogs/new" 
							className="inline-flex items-center px-4 py-2 border rounded hover:bg-gray-100"
						>
							Add Blog
						</a>
					</div>
				)}
				
				{/* Only show pagination if there are multiple pages */}
				{totalPages > 1 && (
					<Pagination 
						page={page} 
						setPage={setPage} 
						hasNext={hasNext} 
						hasPrev={hasPrev} 
					/>
				)}
			</section>
			<Newsletter />
		</>
	)
}