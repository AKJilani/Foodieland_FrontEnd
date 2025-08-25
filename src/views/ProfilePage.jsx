import { useEffect, useState } from 'react'
import { fetchMe, updateMe } from '../api/auth'
import { listMyMessages } from '../api/interactions'

export default function ProfilePage() {
	const [me, setMe] = useState(null)
	const [bio, setBio] = useState('')
	const [name, setName] = useState('')
	const [messages, setMessages] = useState([])

	useEffect(() => {
		fetchMe().then((data)=>{ setMe(data); setBio(data.bio||''); setName(data.name||'') })
		listMyMessages().then((d)=> setMessages(d?.results||[])).catch(()=>{})
	},[])

	async function handleSave(e){
		e.preventDefault()
		const updated = await updateMe({ name, bio })
		setMe(updated)
	}

	return (
		<>
			<section className="max-w-3xl mx-auto px-4 py-12">
				<h2 className="text-2xl font-semibold mb-6">Profile</h2>
				<form onSubmit={handleSave} className="space-y-4">
					<input className="w-full border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
					<textarea className="w-full border rounded px-3 py-2" rows="4" value={bio} onChange={e=>setBio(e.target.value)} placeholder="Bio" />
					<button className="bg-gray-900 text-white px-4 py-2 rounded">Save</button>
				</form>
				<div className="mt-10">
					<h3 className="font-semibold mb-2">Received Messages</h3>
					<div className="space-y-3">
						{messages.map(m => (
							<div key={m.id} className="border rounded p-3">
								<div className="text-sm text-gray-600">From: {m.sender_name} ({m.sender_email})</div>
								<div className="text-gray-800 mt-1">{m.message}</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	)
}


