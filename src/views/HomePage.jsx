import Hero from '../components/Hero'
import CategoryCard from '../components/CategoryCard'
import FeaturedSlider from '../components/FeaturedSlider'
import Newsletter from '../components/Newsletter'
import InstagramStrip from '../components/InstagramStrip'
import TrendingGrid from '../components/TrendingGrid'
import FeaturedChefs from '../components/FeaturedChefs'
import { useQuery } from '@tanstack/react-query'
import { listCategories, listRecipes } from '../api/recipes'

export default function HomePage() {
	const { data: categories } = useQuery({ queryKey: ['recipe-cats'], queryFn: listCategories })
	const { data: recipes } = useQuery({ queryKey: ['recipes', { ordering: '-average_rating' }], queryFn: () => listRecipes({ ordering: '-average_rating' }) })
	return (
		<>
			<Hero />
			<section className="max-w-6xl mx-auto px-4 py-12">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-semibold">Categories</h2>
					<a href="/recipes" className="text-sm text-gray-600 hover:text-gray-900">View all</a>
				</div>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{categories?.results?.slice(0, 8)?.map((c) => (
						<CategoryCard key={c.id} id={c.id} name={c.name} color={c.color || undefined} />
					))}
				</div>
			</section>
			<section className="max-w-6xl mx-auto px-4 py-12">
				<div className="flex items-center justify-between mb-6">
					<div className="w-full text-center mt-2 mb-5">
						<h1 className="text-5xl font-semibold">Simple and tasty recipes</h1>
						<p className="mt-4">Lorem ipsum dolor sit elit, sed do eiusmod tempor incididunt ut labore et dolore ut labore et dolore.</p>
					</div>
					<a href="/recipes" className="text-sm text-gray-600 hover:text-gray-900">Browse all</a>
				</div>
				<FeaturedSlider items={recipes?.results?.slice(0, 10) || []} />
			</section>
			<Newsletter />
			<InstagramStrip />
			<TrendingGrid />
			<FeaturedChefs />
		</>
	)
}


