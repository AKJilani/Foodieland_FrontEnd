import { useState } from 'react'
import { registerUser } from '../../api/auth'


export default function RegisterPage() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e) {
		e.preventDefault()
		setMessage('')
		setError('')
		setLoading(true)
		try {
			await registerUser({ name, email, password })
			setMessage('Registration successful! Please check your email to verify your account.')
		} catch (err) {
			setError(
				err?.response?.data?.detail ||
				err?.response?.data?.email?.[0] ||
				err?.response?.data?.password?.[0] ||
				'Registration failed. Please try again.'
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<div className="max-w-md mx-auto px-4 py-12">
				<h2 className="text-2xl font-semibold mb-6">Create account</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input className="w-full border rounded px-3 py-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
					<input type="email" className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
					<input type="password" className="w-full border rounded px-3 py-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} />
					<button disabled={loading} className="w-full bg-gray-900 text-white py-2 rounded">{loading ? 'Creating...' : 'Create account'}</button>
					{message && <div className="text-green-600 text-sm">{message}</div>}
					{error && <div className="text-red-600 text-sm">{error}</div>}
				</form>
			</div>
		</>
	)
}

