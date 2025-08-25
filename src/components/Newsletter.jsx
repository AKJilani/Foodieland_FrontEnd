export default function Newsletter() {
	return (
		<section className="bg-gray-50">
			<div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
				<div>
					<h3 className="text-2xl font-semibold text-gray-900">Join our newsletter</h3>
					<p className="text-gray-600 mt-2">Get the latest recipes and cooking stories delivered to your inbox.</p>
				</div>
				<form className="flex gap-2">
					<input type="email" className="flex-1 border rounded px-3 py-2" placeholder="Enter your email" required />
					<button className="px-4 py-2 rounded bg-gray-900 text-white">Subscribe</button>
				</form>
			</div>
		</section>
	)
}


