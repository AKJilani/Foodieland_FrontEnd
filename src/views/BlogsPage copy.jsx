import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listBlogs, listBlogCategories } from '../api/blogs'
import Pagination from '../components/Pagination'
import { getAccessToken } from '../api/client'
import { useSearchParams } from 'react-router-dom'

export default function BlogsPage() {
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')
	const [ordering, setOrdering] = useState('-created_at')
	const [params, setParams] = useSearchParams()
	const [selectedCat, setSelectedCat] = useState(params.get('category') || '')
	const { data, refetch } = useQuery({ queryKey: ['blogs', { page, search, ordering }], queryFn: ()=>listBlogs({ page, search, ordering }) })
	const { data: cats } = useQuery({ queryKey: ['blog-cats'], queryFn: listBlogCategories })

	useEffect(()=>{ setPage(1); refetch() }, [search, ordering])
	useEffect(()=>{ setParams(p=>{ selectedCat? p.set('category', selectedCat): p.delete('category'); return p }) }, [selectedCat])

	const filteredResults = useMemo(() => {
		if (!selectedCat) return data?.results || []
		return (data?.results || []).filter(b => b.category === selectedCat)
	}, [data, selectedCat])

	return (
		<>
			<section className="max-w-6xl mx-auto px-4 py-12">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
					<h2 className="text-2xl font-semibold">Blogs</h2>
					<div className="flex gap-2">
						<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search blogs..." className="border rounded px-3 py-2 w-64" />
						<select value={ordering} onChange={e=>setOrdering(e.target.value)} className="border rounded px-3 py-2">
							<option value="-created_at">Newest</option>
						</select>
					</div>
				</div>
				<div className="flex gap-2 overflow-x-auto pb-2 mb-6">
					<button onClick={()=>setSelectedCat('')} className={`px-3 py-1 border rounded whitespace-nowrap ${selectedCat===''?'bg-gray-900 text-white':''}`}>All</button>
					{cats?.results?.map(c => (
						<button key={c.id} onClick={()=>setSelectedCat(c.id)} className={`px-3 py-1 border rounded whitespace-nowrap ${selectedCat===c.id?'bg-gray-900 text-white':''}`}>{c.name}</button>
					))}
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredResults.map(b => (
						<article key={b.id} className="border rounded overflow-hidden">
							{b.featured_image && <img src={b.featured_image} alt={b.title} className="w-full h-48 object-cover" />}
							<div className="p-4">
								<h3 className="text-lg font-semibold line-clamp-1">{b.title}</h3>
								<p className="text-sm text-gray-600 line-clamp-2">{b.description}</p>
								<a href={`/blogs/${b.id}`} className="text-sm text-gray-900 mt-2 inline-block">Read more →</a>
							</div>
						</article>
					))}
				</div>
				{getAccessToken() && (
					<div className="mt-6">
						<a href="/blogs/new" className="inline-flex items-center px-4 py-2 border rounded">Add Blog</a>
					</div>
				)}
				<Pagination page={page} setPage={setPage} hasNext={Boolean(data?.next)} hasPrev={Boolean(data?.previous)} />
			</section>
		</>
	)
}


