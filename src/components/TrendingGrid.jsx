import { useQuery } from '@tanstack/react-query'
import { listRecipes } from '../api/recipes'
import RecipeCard from './RecipeCard'

export default function TrendingGrid() {
	const { data } = useQuery({
		queryKey: ['recipes', { ordering: '-total_ratings' }],
		queryFn: () => listRecipes({ ordering: '-total_ratings' })
	})

	return (
		<section className="max-w-8xl mx-auto px-4 py-12 ml-40 mr-40">
			<div className="flex items-center justify-between mb-8">
				<div className='flex item-left w-full mt-20 mb-5'>
					<h1 className="text-4xl font-semibold mr-40">Try these delicious recipes to make your day</h1>
					<p className='ml-40'>Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqut enim ad minim</p>
				</div>
				<a href="/recipes" className="text-sm text-gray-600 hover:text-gray-900">See all</a>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
				{data?.results?.slice(0, 9)?.map((r) => (
					<div
						key={r.id}
						className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
					>
						{/* Optional hover overlay */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

						<div className="relative z-20">
							<RecipeCard {...r} />
						</div>
					</div>
				))}
			</div>
		</section>
	)
}