export default function FeaturedChefs() {
	const chefs = [
		{ name: 'Alex', role: 'Chef', img: 'https://images.unsplash.com/photo-1542181961-9590d0c79dab?q=80&w=400' },
		{ name: 'Maya', role: 'Baker', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400' },
		{ name: 'Kenji', role: 'Food Blogger', img: 'https://images.unsplash.com/photo-1532634947-0917833aee72?q=80&w=400' },
	]
	return (
		<section className="max-w-6xl mx-auto px-4 py-12">
			<h2 className="text-xl font-semibold mb-6">Featured Chefs</h2>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-6">
				{chefs.map((c, i) => (
					<div key={i} className="border rounded-xl bg-white p-4 text-center">
						<div className="aspect-square overflow-hidden rounded-full w-28 h-28 mx-auto">
							<img src={c.img} alt={c.name} className="w-full h-full object-cover" />
						</div>
						<div className="mt-3 font-semibold">{c.name}</div>
						<div className="text-sm text-gray-600">{c.role}</div>
					</div>
				))}
			</div>
		</section>
	)
}