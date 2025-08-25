export default function Footer() {
	return (
		<footer className="border-t bg-white">
			<div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8 text-sm text-gray-600">
				<div className="col-span-2">
					<div className="text-xl font-semibold text-gray-900">FoodieLand</div>
					<p className="mt-3 max-w-sm">A community-driven place to discover and share delicious recipes and cooking stories.</p>
				</div>
				<div>
					<div className="font-semibold text-gray-900">Links</div>
					<ul className="mt-3 space-y-2">
						<li><a href="/" className="hover:text-gray-900">Home</a></li>
						<li><a href="/recipes" className="hover:text-gray-900">Recipes</a></li>
						<li><a href="/blogs" className="hover:text-gray-900">Blogs</a></li>
						<li><a href="/contact" className="hover:text-gray-900">Contact</a></li>
					</ul>
				</div>
				<div>
					<div className="font-semibold text-gray-900">Follow</div>
					<div className="mt-3 flex items-center gap-3">
						<a href="#" aria-label="Instagram" className="h-8 w-8 grid place-content-center rounded-full border">IG</a>
						<a href="#" aria-label="YouTube" className="h-8 w-8 grid place-content-center rounded-full border">YT</a>
						<a href="#" aria-label="Facebook" className="h-8 w-8 grid place-content-center rounded-full border">FB</a>
					</div>
				</div>
			</div>
			<div className="border-t bg-gray-50 text-center">
				<div className="max-w-6xl mx-auto px-4 py-6 text-xs text-gray-500">© {new Date().getFullYear()} FoodieLand. All rights reserved.</div>
			</div>
		</footer>
	)
}