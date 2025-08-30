import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import FeaturedSlider from '../components/FeaturedSlider';
import Newsletter from '../components/Newsletter';
import InstagramStrip from '../components/InstagramStrip';
import TrendingGrid from '../components/TrendingGrid';
import FeaturedChefs from '../components/FeaturedChefs';
import { listCategories, listRecipes } from '../api/recipes';
import { listUsers } from '../api/auth';

export default function HomePage() {
	const [showAllCategories, setShowAllCategories] = useState(false);

	const { data: categories } = useQuery({
		queryKey: ['recipe-cats'],
		queryFn: listCategories
	});

	// Fetching latest recipes for the FeaturedSlider
	const { data: latestRecipes } = useQuery({
		queryKey: ['latest-recipes'],
		queryFn: () => listRecipes({ ordering: '-created_at' })
	});

	// Fetching trending recipes for the TrendingGrid and Hero section
	const { data: trendingRecipes } = useQuery({
		queryKey: ['trending-recipes'],
		queryFn: () => listRecipes({ ordering: '-total_ratings' })
	});

	// Get unique author IDs from both recipe sets
	const authorIds = useMemo(() => {
		const ids = new Set();
		latestRecipes?.results?.forEach(recipe => {
			if (recipe.author_id) {
				ids.add(recipe.author_id);
			}
		});
		trendingRecipes?.results?.forEach(recipe => {
			if (recipe.author_id) {
				ids.add(recipe.author_id);
			}
		});
		return Array.from(ids);
	}, [latestRecipes, trendingRecipes]);

	// Fetch users only for the author IDs we need
	const { data: users, error: usersError, isLoading: usersLoading } = useQuery({
		queryKey: ['users', authorIds],
		queryFn: () => listUsers(),
		enabled: authorIds.length > 0,
	});

	// Memoize a map for quick category name lookup
	const categoryMap = useMemo(() => {
		const map = new Map();
		categories?.results?.forEach(cat => {
			map.set(cat.id, cat.name);
		});
		return map;
	}, [categories]);

	// Memoize a map for quick user name lookup by ID
	const userMap = useMemo(() => {
		const map = new Map();
		// Check different possible data structures
		const userArray = users?.results || users?.data || users;

		if (Array.isArray(userArray)) {
			userArray.forEach(user => {
				map.set(user.id, user.name);
			});
		}
		return map;
	}, [users]);

	// Transforming latest recipes to include category and author name
	const transformedLatestRecipes = useMemo(() => {
		if (!latestRecipes?.results) return [];
		return latestRecipes.results.map(recipe => {
			const authorName = userMap.get(recipe.author_id);
			return {
				...recipe,
				category: categoryMap.get(recipe.category) || 'Unknown Category',
				author: authorName || 'Unknown Author'
			};
		});
	}, [latestRecipes, categoryMap, userMap]);

	// Transforming trending recipes to include category and author name
	const transformedTrendingRecipes = useMemo(() => {
		if (!trendingRecipes?.results) return [];
		return trendingRecipes.results.map(recipe => {
			const authorName = userMap.get(recipe.author_id);
			return {
				...recipe,
				category: categoryMap.get(recipe.category) || 'Unknown Category',
				author: authorName || 'Unknown Author'
			};
		});
	}, [trendingRecipes, categoryMap, userMap]);

	// Determine which categories to display
	const displayedCategories = useMemo(() => {
		if (!categories?.results) return [];
		return showAllCategories ? categories.results : categories.results.slice(0, 5);
	}, [categories, showAllCategories]);

	// Check if there are more categories to show
	const hasMoreCategories = categories?.results?.length > 5;

	const handleToggleCategories = () => {
		setShowAllCategories(!showAllCategories);
	};

	return (
		<>
			<Hero featuredRecipes={transformedTrendingRecipes.slice(0, 5)} />
			<section className="max-w-6xl mx-auto px-4 py-12">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-semibold">Categories</h2>
					{hasMoreCategories && (
						<button
							onClick={handleToggleCategories}
							className="text-sm font-semibold text-white bg-gray-900 px-6 py-4 rounded-full hover:bg-gray-800 transition-colors duration-300"
						>
							{showAllCategories ? 'Show Less' : 'View All Categories'}
						</button>
					)}
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
					{displayedCategories?.map((c) => (
						<CategoryCard key={c.id} id={c.id} icon={c.icon} name={c.name} color={c.color || undefined} />
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
				<FeaturedSlider items={transformedLatestRecipes.slice(0, 9)} />
			</section>
			<Newsletter />
			<InstagramStrip />
			<TrendingGrid items={transformedTrendingRecipes.slice(0, 8)} />
			<FeaturedChefs />
		</>
	);
}