import { useState } from 'react'

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('')
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e) {
		e.preventDefault()
		setMessage('')
		setError('')
		setLoading(true)
		try {
			const response = await fetch('http://localhost:8000/api/auth/request-password-reset/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			})
			if (!response.ok) {
				const data = await response.json()
				throw new Error(data.detail || Object.values(data)[0])
			}
			setMessage('Reset email sent! Check your inbox.')
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="max-w-md mx-auto px-4 py-12">
			<h2 className="text-2xl font-semibold mb-6">Forgot Password</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					placeholder="Enter your email"
					required
					className="w-full border rounded px-3 py-2"
				/>
				<button
					type="submit"
					disabled={loading}
					className={`w-full py-2 rounded ${loading ? 'bg-gray-400' : 'bg-gray-900'} text-white`}
				>
					{loading ? 'Sending...' : 'Send Reset Link'}
				</button>
				{message && <div className="text-green-600 text-sm">{message}</div>}
				{error && <div className="text-red-600 text-sm">{error}</div>}
			</form>
		</div>
	)
}
