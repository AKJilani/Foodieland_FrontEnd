import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { listCategories, listRecipes } from '../api/recipes'
import RecipeCard from '../components/RecipeCard'
import { getAccessToken } from '../api/client'
import Pagination from '../components/Pagination'

export default function RecipesPage() {
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')
	const [ordering, setOrdering] = useState('-created_at')
	const [params, setParams] = useSearchParams()
	const [selectedCat, setSelectedCat] = useState(params.get('category') || '')

	const { data: cats } = useQuery({ queryKey: ['recipe-cats'], queryFn: listCategories })
	const { data, refetch, isFetching } = useQuery({ queryKey: ['recipes', { page, search, ordering }], queryFn: () => listRecipes({ page, search, ordering }) })

	useEffect(() => { setPage(1); refetch() }, [search, ordering])
	useEffect(() => { setParams(p=>{ selectedCat? p.set('category', selectedCat): p.delete('category'); return p }) }, [selectedCat])

	const filteredResults = useMemo(() => {
		if (!selectedCat) return data?.results || []
		return (data?.results || []).filter(r => r.category === selectedCat)
	}, [data, selectedCat])

	return (
		<>
			<section className="max-w-6xl mx-auto px-4 py-12">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
					<h2 className="text-2xl font-semibold">Recipes</h2>
					<div className="flex gap-2">
						<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search recipes..." className="border rounded px-3 py-2 w-64" />
						<select value={ordering} onChange={e=>setOrdering(e.target.value)} className="border rounded px-3 py-2">
							<option value="-created_at">Newest</option>
							<option value="average_rating">Rating (Low→High)</option>
							<option value="-average_rating">Rating (High→Low)</option>
						</select>
					</div>
				</div>
				<div className="flex gap-2 overflow-x-auto pb-2 mb-6">
					<button onClick={()=>setSelectedCat('')} className={`px-3 py-1 border rounded whitespace-nowrap ${selectedCat===''?'bg-gray-900 text-white':''}`}>All</button>
					{cats?.results?.map(c => (
						<button key={c.id} onClick={()=>setSelectedCat(c.id)} className={`px-3 py-1 border rounded whitespace-nowrap ${selectedCat===c.id?'bg-gray-900 text-white':''}`}>{c.name}</button>
					))}
				</div>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{filteredResults.map(r => (<RecipeCard key={r.id} {...r} />))}
				</div>
				{getAccessToken() && (
					<div className="mt-6">
						<a href="/recipes/new" className="inline-flex items-center px-4 py-2 border rounded">Add Recipe</a>
					</div>
				)}
				<Pagination page={page} setPage={setPage} hasNext={Boolean(data?.next)} hasPrev={Boolean(data?.previous)} />
			</section>
		</>
	)
}


