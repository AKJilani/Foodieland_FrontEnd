import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
	getRecipe, listMyFavorites, addFavorite, removeFavorite,
	listMyRatings, createRating, updateRating, listRecipes, listCategories
} from '../api/recipes'

import { useState, useEffect, useMemo } from 'react'
import RecipeCard from '../components/RecipeCard'
import Newsletter from '../components/Newsletter';

export default function RecipeDetailsPage() {
	const { id } = useParams()
	const { data } = useQuery({ queryKey: ['recipe', id], queryFn: () => getRecipe(id) })
	const { data: related } = useQuery({ queryKey: ['related', id], queryFn: () => listRecipes({ ordering: '-created_at' }) })
	const r = data || {}
	const [favoriteId, setFavoriteId] = useState(null)
	const [myRating, setMyRating] = useState(null)

	// Then add this after your existing queries:
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

	useEffect(() => {
		listMyFavorites().then(d => {
			const f = (d?.results || []).find(x => String(x.recipe) === String(id))
			setFavoriteId(f?.id || null)
		}).catch(() => { })
		listMyRatings().then(d => {
			const rate = (d?.results || []).find(x => String(x.recipe) === String(id))
			setMyRating(rate || null)
		}).catch(() => { })
	}, [id])

	async function toggleFavorite() {
		if (favoriteId) {
			await removeFavorite(favoriteId)
			setFavoriteId(null)
		} else {
			const f = await addFavorite({ recipe: id })
			setFavoriteId(f.id)
		}
	}

	async function handleRate(value) {
		if (myRating) {
			const updated = await updateRating(myRating.id, { rating: value })
			setMyRating(updated)
		} else {
			const created = await createRating({ recipe: id, rating: value })
			setMyRating(created)
		}
	}

	return (
		<>
			{/* Hero + Nutrition Section */}
			<section className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-6 bg">
				<div className="bg-white rounded-2xl shadow-sm overflow-hidden">
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
							<span>{Number(r.average_rating || 0).toFixed(1)} ★</span>
						</div>

						{/* Favorites + Rating */}
						<div className="mt-5 flex flex-wrap items-center gap-4">
							<button
								onClick={toggleFavorite}
								className={`px-4 py-2 rounded-lg border transition ${favoriteId
									? 'bg-red-500 text-white border-red-500'
									: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
									}`}
							>
								{favoriteId ? '❤️ Favorited' : '🤍 Add to Favorites'}
							</button>

							<div className="flex items-center gap-1">
								{[1, 2, 3, 4, 5].map(v => (
									<button
										key={v}
										onClick={() => handleRate(v)}
										className={`text-2xl transition ${v <= (myRating?.rating || 0) ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
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

				{/* Nutritional Information */}
				<div className="bg-gradient-to-r from-cyan-50 to-cyan-100 shadow-sm rounded-2xl p-6 xl:p-8">
					<h4 className="font-bold text-2xl text-gray-800 mb-16 flex items-center gap-4">🥗 Nutritional Information</h4>
					{r.nutrition_info ? (
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
							{[
								{ key: 'calories', label: 'Calories', unit: 'kcal', emoji: '🔥' },
								{ key: 'carbohydrates', label: 'Carbohydrates', unit: 'g', emoji: '🥔' },
								{ key: 'cholesterol', label: 'Cholesterol', unit: 'mg', emoji: '🩸' },
								{ key: 'protein', label: 'Protein', unit: 'g', emoji: '🥩' },
								{ key: 'fat', label: 'Fat', unit: 'g', emoji: '🥑' },
								{ key: 'fiber', label: 'Fiber', unit: 'g', emoji: '🥬' },
							].map(({ key, label, unit, emoji }) => (
								<div key={key} className="bg-cyan-100 rounded-xl shadow p-4 flex flex-col items-center">
									<span className="text-2xl">{emoji}</span>
									<span className="text-xs font-semibold text-gray-700">{label}</span>
									<span className="text-gray-600">{r.nutrition_info[key]} {unit}</span>
								</div>
							))}
							<p className="text-xs col-start-1 col-end-4 items-center text-center text-gray-500 mt-4">
								(Note: Nutritional values are approximate and may vary based on ingredients and preparation methods.)
							</p>
						</div>
					) : (
						<p className="mt-4 text-center text-gray-600">No nutritional information available.</p>
					)}
				</div>
			</section>

			{/* Description */}
			<section className="max-w-7xl mx-auto px-4 grid gap-6 mt-8">
				<div>
					<h3 className="text-xl font-semibold mb-4">📖 Description</h3>
					<p className="text-lg">{r.description || 'No description available.'}</p>
				</div>
			</section>

			{/* Ingredients */}
			{Array.isArray(r.ingredients) && (
				<section className="max-w-7xl mx-auto px-4 grid gap-6 mt-8 bg-white rounded-2xl shadow-sm p-6">
					<div className="grid md:grid-cols-2 gap-6">
						<div className="max-w-4xl">
							<h3 className="text-xl font-semibold mb-4">🛒 Ingredients</h3>
							<ul className="list-disc pl-5 space-y-1 text-gray-700">
								{r.ingredients.map((it, idx) => (<li key={idx}>{it}</li>))}
							</ul>
						</div>
						<div className="max-w-2xl mx-auto flex flex-col gap-6">
							<h3 className="text-xl font-semibold">Other Recipes</h3>
							{related?.results?.slice(0, 3)?.map(r => (
								<div key={r.id} className="w-full">
									<Link
										to={`/recipes/${r.id}`}
										className="flex items-center gap-4 bg-white rounded-2xl shadow-sm hover:shadow-md overflow-hidden transition-shadow duration-300"
									>
										{/* Recipe Image */}
										<div className="w-32 h-32 bg-gray-100 flex-shrink-0">
											{r.image ? (
												<img
													src={r.image}
													alt={r.title}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full bg-gray-200" />
											)}
										</div>

										{/* Title & Author */}
										<div className="p-4 flex flex-col justify-center">
											<h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
												{r.title}
											</h3>
											<span className="text-sm text-gray-600 mt-1">
												by {r.author_name || 'Unknown'}
											</span>
										</div>
									</Link>
								</div>
							))}
						</div>

					</div>
				</section>
			)}

			{/* Preparation */}
			{Array.isArray(r.preparation_steps) && (
				<section className="max-w-7xl mx-auto px-4 grid gap-6 mt-8">
					<div>
						<h3 className="text-xl font-semibold mb-4">👩‍🍳 Preparation</h3>
						<ol className="list-decimal pl-5 space-y-2 text-gray-700">
							{r.preparation_steps.map((st, idx) => (<li key={idx}>{st}</li>))}
						</ol>
					</div>
				</section>
			)}
			{/* Newsletter Signup */}
			<Newsletter />

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
		</>
	)
}