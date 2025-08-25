import { useState } from 'react'
import { loginUser } from '../../api/auth'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	async function handleSubmit(e) {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			// Validate input
			if (!email || !password) {
				setError('Both email and password are required')
				setLoading(false)
				return
			}

			await loginUser({ email, password })
			window.location.href = '/'
		} catch (err) {
			console.error('Login error:', err?.response?.data)
			
			// Get the most specific error message
			const errorMessage = 
				err?.response?.data?.email?.[0] || // Email verification errors
				err?.response?.data?.password?.[0] || // Password-specific errors
				err?.response?.data?.non_field_errors?.[0] || // General errors
				err?.response?.data?.detail || // API error details
				'Login failed. Please try again.' // Fallback message
			
			setError(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<div className="max-w-md mx-auto px-4 py-12">
				<h2 className="text-2xl font-semibold mb-6">Login</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<input 
							type="email" 
							className={`w-full border ${error?.includes('email') ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
							placeholder="Email" 
							value={email} 
							onChange={e=>setEmail(e.target.value)} 
							required 
						/>
					</div>
					<div>
						<input 
							type="password" 
							className={`w-full border ${error?.includes('password') ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
							placeholder="Password" 
							value={password} 
							onChange={e=>setPassword(e.target.value)} 
							required 
						/>
					</div>
					{error && (
						<div className="bg-red-50 border border-red-200 rounded p-3">
							<p className="text-red-600 text-sm">{error}</p>
						</div>
					)}
					<button 
						disabled={loading} 
						className={`w-full py-2 rounded ${loading ? 'bg-gray-400' : 'bg-gray-900'} text-white`}
					>
						{loading ? 'Logging in...' : 'Login'}
					</button>
				</form>
			</div>
		</>
	)
}