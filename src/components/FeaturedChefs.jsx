import JilaniImg from '../assets/Jilani.jpg';
import ZareerImg from '../assets/Zareer.jpg';
import FaiyazImg from '../assets/Faiyaz.jpg';
import ShafayetImg from '../assets/Shafayet.jpg';
import AlAminImg from '../assets/Al Amin.jpg';

export default function FeaturedChefs() {
	const chefs = [
		{ name: 'A.K.Jilani', role: 'Chef', img: JilaniImg },
		{ name: 'Zareer', role: 'Baker', img: ZareerImg },
		{ name: 'Faiyaz', role: 'Food Blogger', img: FaiyazImg },
		{ name: 'Shafayet', role: 'Food Reviewer', img: ShafayetImg },
		{ name: 'Al Amin', role: 'Recipe Expert', img: AlAminImg },
	]
	return (
		<section className="max-w-6xl mx-auto px-4 py-12">
			<h2 className="text-xl font-semibold mb-6">Featured Chefs</h2>
			<div className="grid grid-cols-2 md:grid-cols-5 gap-6">
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