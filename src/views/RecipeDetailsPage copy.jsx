import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getRecipe, listMyFavorites, addFavorite, removeFavorite, listMyRatings, createRating, updateRating, listRecipes } from '../api/recipes'
import { useState, useEffect } from 'react'
import RecipeCard from '../components/RecipeCard'
import { useQueryClient } from '@tanstack/react-query'

export default function RecipeDetailsPage() {
	const { id } = useParams()
	const { data } = useQuery({ queryKey: ['recipe', id], queryFn: ()=>getRecipe(id) })
	const { data: related } = useQuery({ queryKey: ['related', id], queryFn: ()=> listRecipes({ ordering: '-created_at' }) })
	const r = data || {}
	const [favoriteId, setFavoriteId] = useState(null)
	const [myRating, setMyRating] = useState(null)

	useEffect(()=>{
		listMyFavorites().then(d=>{
			const f = (d?.results||[]).find(x=>x.recipe===id)
			setFavoriteId(f?.id||null)
		}).catch(()=>{})
		listMyRatings().then(d=>{
			const rate = (d?.results||[]).find(x=>x.recipe===id)
			setMyRating(rate||null)
		}).catch(()=>{})
	},[id])

	async function toggleFavorite(){
		if(favoriteId){ await removeFavorite(favoriteId); setFavoriteId(null) }
		else { const f = await addFavorite({ recipe: id }); setFavoriteId(f.id) }
	}

	async function handleRate(value){
		if(myRating){
			const updated = await updateRating(myRating.id, { rating: value })
			setMyRating(updated)
		}else{
			const created = await createRating({ recipe: id, rating: value })
			setMyRating(created)
		}
	}
	return (
		<>
			<section className="max-w-3xl mx-auto px-4 py-12">
				{r.image && <img src={r.image} alt={r.title} className="w-full h-64 object-cover rounded" />}
				<h1 className="text-3xl font-bold mt-6">{r.title || '...'}</h1>
				<div className="text-sm text-gray-600 mt-1">by {r.author_name || 'Unknown'} · {Number(r.average_rating||0).toFixed(1)}★</div>
				<div className="mt-4 flex items-center gap-3">
					<button onClick={toggleFavorite} className={`px-3 py-1 rounded border ${favoriteId? 'bg-gray-900 text-white':''}`}>{favoriteId? 'Favorited' : 'Add to Favorites'}</button>
					<div className="flex items-center gap-1">
						{[1,2,3,4,5].map(v => (
							<button key={v} onClick={()=>handleRate(v)} className={`text-xl ${v <= (myRating?.rating||0) ? 'text-yellow-500' : 'text-gray-300'}`}>★</button>
						))}
						<span className="text-sm text-gray-600 ml-2">Your rating</span>
					</div>
				</div>
				{Array.isArray(r.ingredients) && (
					<div className="mt-6">
						<h3 className="font-semibold mb-2">Ingredients</h3>
						<ul className="list-disc pl-5 space-y-1 text-gray-700">
							{r.ingredients.map((it, idx)=>(<li key={idx}>{it}</li>))}
						</ul>
					</div>
				)}
				{Array.isArray(r.preparation_steps) && (
					<div className="mt-6">
						<h3 className="font-semibold mb-2">Preparation</h3>
						<ol className="list-decimal pl-5 space-y-2 text-gray-700">
							{r.preparation_steps.map((st, idx)=>(<li key={idx}>{st}</li>))}
						</ol>
					</div>
				)}
			</section>
			<section className="max-w-6xl mx-auto px-4 py-12">
				<h3 className="text-xl font-semibold mb-6">You may also like</h3>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{related?.results?.slice(0,4)?.map(r => (<RecipeCard key={r.id} {...r} />))}
				</div>
			</section>
		</>
	)
}


