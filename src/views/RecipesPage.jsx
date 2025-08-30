import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { listCategories, listRecipes } from '../api/recipes'
import RecipeCard from '../components/RecipeCard'
import { getAccessToken } from '../api/client'
import Pagination from '../components/Pagination'
import Newsletter from '../components/Newsletter'

export default function RecipesPage() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [ordering, setOrdering] = useState('-created_at')
    const [params, setParams] = useSearchParams()
    const [selectedCat, setSelectedCat] = useState(params.get('category') || '')

    const ITEMS_PER_PAGE = 8 // 2 rows × 4 cards for recipes

    const { data: cats } = useQuery({ 
        queryKey: ['recipe-cats'], 
        queryFn: listCategories 
    })
    
    // Fetch ALL recipes without pagination
    const { data, isLoading } = useQuery({ 
        queryKey: ['recipes', { search, ordering }], 
        queryFn: () => listRecipes({ 
            search, 
            ordering,
            // Don't pass page or limit - get all results
        }) 
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

    // Create a map for quick category name lookup
    const categoryMap = useMemo(() => {
        const map = new Map();
        cats?.results?.forEach(cat => {
            map.set(cat.id, cat.name);
        });
        return map;
    }, [cats]);

    // Filter and paginate on the frontend
    const { paginatedResults, totalPages, hasNext, hasPrev } = useMemo(() => {
        let allResults = data?.results || []
        
        // Filter by category if selected
        if (selectedCat) {
            allResults = allResults.filter(r => r.category === selectedCat)
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

    // Get related recipes (separate from main results)
    const { data: related } = useQuery({
        queryKey: ['related-recipes'],
        queryFn: () => listRecipes({ ordering: '-created_at' }),
    })

    return (
        <>
            <section className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-semibold">Recipes</h2>
                    <div className="flex gap-2">
                        <input 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                            placeholder="Search recipes..." 
                            className="border rounded px-3 py-2 w-64" 
                        />
                        <select 
                            value={ordering} 
                            onChange={e => setOrdering(e.target.value)} 
                            className="border rounded px-3 py-2"
                        >
                            <option value="-created_at">Newest</option>
                            <option value="average_rating">Rating (Low→High)</option>
                            <option value="-average_rating">Rating (High→Low)</option>
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
                        ((data?.results || []).filter(r => r.category === selectedCat).length) : 
                        (data?.results?.length || 0)} recipes
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {paginatedResults.map(r => (
                        <RecipeCard
                            key={r.id}
                            {...r}
                            category={categoryMap.get(r.category)} // Pass the category name here
                        />
                    ))}
                </div>

                {paginatedResults.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {search || selectedCat ? 'No recipes found matching your criteria.' : 'No recipes found.'}
                        </p>
                    </div>
                )}
                
                {getAccessToken() && (
                    <div className="mt-6">
                        <a 
                            href="/recipes/new" 
                            className="inline-flex items-center px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Add Recipe
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

            {/* Related Recipes */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <h3 className="text-2xl font-bold mb-6">🍲 You may also like</h3>
                <div className="flex gap-6 overflow-x-auto pb-2">
                    {related?.results?.slice(0, 6)?.map(r => (
                        <div key={r.id} className="w-64 flex-shrink-0">
                            <RecipeCard {...r} category={categoryMap.get(r.category)} />
                        </div>
                    ))}
                </div>
            </section>
            
            <Newsletter />
        </>
    )
}