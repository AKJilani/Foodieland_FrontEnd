export default function InstagramStrip() {
	const imgs = [
		'https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?q=80&w=400',
		'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=400',
		'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=400',
		'https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=400',
		'https://images.unsplash.com/photo-1526312426976-593c6cfd36ce?q=80&w=400'
	]
	return (
		<section>
			<div className="max-w-6xl mx-auto px-4 py-12">
				<h3 className="text-xl font-semibold">Follow us on Instagram</h3>
				<div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
					{imgs.map((src, i)=>(
						<a key={i} href="#" className="block rounded overflow-hidden border">
							<img src={src} alt="instagram" className="w-full h-36 object-cover" />
						</a>
					))}
				</div>
			</div>
		</section>
	)
}


