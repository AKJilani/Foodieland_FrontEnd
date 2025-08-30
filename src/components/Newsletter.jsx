import { useState } from 'react';
import { subscribeNewsletter } from '../api/interactions';
import Swal from 'sweetalert2';
import LeftPlate from '../assets/leftside-Newsletter-Photo-plate.png';
import RightPlate from '../assets/rightside-Newsletter-Photo-plate.png';

export default function Newsletter() {
	const [email, setEmail] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await subscribeNewsletter(email);
			Swal.fire("Success", "You have subscribed successfully!", "success");
			setEmail(""); // clear input after success
		} catch (err) {
			console.error(err);
			if (err.response?.status === 400) {
				Swal.fire("Error", "This email is already subscribed.", "error");
			} else {
				Swal.fire("Error", "Something went wrong. Try again.", "error");
			}
		}
	};

	return (
		<section className="relative py-20">
			<div className="max-w-7xl mx-auto px-4 relative p-20 rounded-3xl" style={{ backgroundColor: "#E7F9FD" }}>
				<div className="text-center relative z-10 max-w-3xl mx-auto">
					<h1 className="text-5xl font-bold text-gray-900 mb-6">
						Deliciousness to your inbox
					</h1>
					<p className="text-gray-600 text-lg mb-10 leading-relaxed px-8">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					</p>

					{/* Email Subscription Form */}
					<div className="flex gap-0 max-w-lg mx-auto">
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="flex-1 border-0 rounded-l-full px-8 py-4 text-gray-500 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 placeholder-gray-400 text-lg"
							placeholder="Your Email Address ..."
						/>
						<button
							onClick={handleSubmit}
							className="px-10 py-4 rounded-r-full bg-black text-white font-medium hover:bg-gray-800 transition-colors text-lg"
						>
							subscribe
						</button>
					</div>
				</div>

				{/* Decorative Images */}
				<div>
					<div className="absolute bottom-0 left-0 overflow-hidden">
						<img src={LeftPlate} alt="Decorative Left" style={{ borderBottomLeftRadius: '3rem' }} />
					</div>
					<div className="absolute bottom-0 right-0 overflow-hidden">
						<img src={RightPlate} alt="Decorative Right" style={{ borderBottomRightRadius: '3rem' }} />
					</div>
				</div>
			</div>
		</section>
	)
}