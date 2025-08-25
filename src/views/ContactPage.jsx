import { useState } from 'react'
import { sendContactMessage } from '../api/interactions'

export default function ContactPage() {
	const [sender_name, setName] = useState('')
	const [sender_email, setEmail] = useState('')
	const [message, setMessage] = useState('')
	const [recipient, setRecipient] = useState('')
	const [info, setInfo] = useState('')

	async function handleSubmit(e) {
		e.preventDefault()
		setInfo('')
		try {
			await sendContactMessage({ sender_name, sender_email, message, recipient })
			setInfo('Message sent!')
			setName(''); setEmail(''); setMessage('')
		} catch (e) {
			setInfo('Failed to send message')
		}
	}

	return (
		<>
			<section className="max-w-3xl mx-auto px-4 py-12">
				<h2 className="text-2xl font-semibold mb-6">Contact Us</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input className="w-full border rounded px-3 py-2" placeholder="Your name" value={sender_name} onChange={e=>setName(e.target.value)} required />
					<input type="email" className="w-full border rounded px-3 py-2" placeholder="Your email" value={sender_email} onChange={e=>setEmail(e.target.value)} required />
					<input className="w-full border rounded px-3 py-2" placeholder="Recipient user id" value={recipient} onChange={e=>setRecipient(e.target.value)} />
					<textarea className="w-full border rounded px-3 py-2" rows="5" placeholder="Message" value={message} onChange={e=>setMessage(e.target.value)} required />
					<button className="bg-gray-900 text-white px-4 py-2 rounded">Send</button>
					{info && <div className="text-sm text-gray-600">{info}</div>}
				</form>
			</section>
		</>
	)
}


