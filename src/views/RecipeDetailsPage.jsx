import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
	getRecipe, listMyFavorites, addFavorite, removeFavorite, 
	listMyRatings, createRating, updateRating, listRecipes 
} from '../api/recipes'
import { useState, useEffect } from 'react'
import RecipeCard from '../components/RecipeCard'

export default function RecipeDetailsPage() {
	const { id } = useParams()
	const { data } = useQuery({ queryKey: ['recipe', id], queryFn: ()=>getRecipe(id) })
	const { data: related } = useQuery({ queryKey: ['related', id], queryFn: ()=> listRecipes({ ordering: '-created_at' }) })
	const r = data || {}
	const [favoriteId, setFavoriteId] = useState(null)
	const [myRating, setMyRating] = useState(null)

	useEffect(()=>{
		listMyFavorites().then(d=>{
			const f = (d?.results||[]).find(x=>String(x.recipe)===String(id))
			setFavoriteId(f?.id||null)
		}).catch(()=>{})
		listMyRatings().then(d=>{
			const rate = (d?.results||[]).find(x=>String(x.recipe)===String(id))
			setMyRating(rate||null)
		}).catch(()=>{})
	},[id])

	async function toggleFavorite(){
		if(favoriteId){ 
			await removeFavorite(favoriteId)
			setFavoriteId(null) 
		} else { 
			const f = await addFavorite({ recipe: id })
			setFavoriteId(f.id) 
		}
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
			{/* Recipe Hero Section */}
			<section className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-4">
				<div className="bg-white rounded-2xl shadow-md overflow-hidden">
					{r.image && (
						<img 
							src={r.image} 
							alt={r.title} 
							className="w-full h-80 object-cover"
						/>
					)}

					<div className="p-6">
						<h1 className="text-4xl font-bold text-gray-800">{r.title || '...'}</h1>
						<div className="mt-2 flex items-center gap-3 text-gray-600 text-sm">
							<span>👨‍🍳 {r.author_name || 'Unknown'}</span>
							<span>·</span>
							<span>{Number(r.average_rating||0).toFixed(1)} ★</span>
						</div>

						{/* Favorites + Rating */}
						<div className="mt-5 flex flex-wrap items-center gap-4">
							<button 
								onClick={toggleFavorite} 
								className={`px-4 py-2 rounded-lg border transition ${
									favoriteId 
									? 'bg-red-500 text-white border-red-500' 
									: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
								}`}
							>
								{favoriteId ? '❤️ Favorited' : '🤍 Add to Favorites'}
							</button>

							<div className="flex items-center gap-1">
								{[1,2,3,4,5].map(v => (
									<button 
										key={v} 
										onClick={()=>handleRate(v)} 
										className={`text-2xl transition ${
											v <= (myRating?.rating||0) ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
										}`}
									>
										★
									</button>
								))}
								<span className="ml-2 text-sm text-gray-600">Your rating</span>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-cyan-200 shadow-md rounded-2xl p-6 overflow-hidden">
					<h1 className="text-2xl flex items-center justify-center">Nutritional Information</h1>
					{r.nutritional_info ? (
						<div className="mt-4 grid grid-cols-2 gap-4">
							{Object.entries(r.nutritional_info).map(([key, value])=>(
								<div key={key} className="bg-white rounded-lg p-4 text-center shadow">
									<h2 className="text-lg font-semibold text-gray-700">{key.replace(/_/g, ' ')}</h2>
									<p className="mt-2 text-2xl font-bold text-indigo-600">{value}</p>
								</div>
							))}
						</div>
					) : (
						<p className="mt-4 text-center text-gray-600">No nutritional information available.</p>
					)}
				</div>
			</section>

			{/* Description */}
			<section className="max-w-6xl mx-auto px-4 grid gap-6">
				<div className="bg-white rounded-2xl shadow-md p-6">
					<h3 className="text-xl font-semibold mb-4">📖 Description</h3>
					<p className="text-lg">{r.description || 'No description available.'}</p>
				</div>
			</section>

			{/* Ingredients + Preparation */}
			<section className="max-w-6xl mx-auto px-4 grid gap-8 mt-8">
				{Array.isArray(r.ingredients) && (
					<div className="bg-white rounded-2xl shadow-md p-6">
						<h3 className="text-xl font-semibold mb-4">🛒 Ingredients</h3>
						<ul className="list-disc pl-5 space-y-1 text-gray-700">
							{r.ingredients.map((it, idx) => (
								<li key={idx}>{it}</li>
							))}
						</ul>
					</div>
				)}
			</section>
			<section className="max-w-6xl mx-auto px-4 grid gap-8 mt-8">
				{Array.isArray(r.preparation_steps) && (
					<div className="bg-white rounded-2xl shadow-md p-6">
						<h3 className="text-xl font-semibold mb-4">👩‍🍳 Preparation</h3>
						<ol className="list-decimal pl-5 space-y-2 text-gray-700">
							{r.preparation_steps.map((st, idx) => (
								<li key={idx}>{st}</li>
							))}
						</ol>
					</div>
				)}
			</section>

			{/* Related Recipes */}
			<section className="max-w-6xl mx-auto px-4 py-12">
				<h3 className="text-2xl font-bold mb-6">🍲 You may also like</h3>
				<div className="flex gap-6 overflow-x-auto pb-2">
					{related?.results?.slice(0, 6)?.map(r => (
						<div key={r.id} className="w-64 flex-shrink-0">
							<RecipeCard key={r.id} {...r} />
						</div>
					))}
				</div>
			</section>
		</>
	)
}



