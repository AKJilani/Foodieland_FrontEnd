import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import { resetPassword } from '../../api/auth'

export default function ResetPasswordPage() {
	const [params] = useSearchParams()
	const [password, setPassword] = useState('')
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')

	async function handleSubmit(e) {
		e.preventDefault()
		setMessage('')
		setError('')
		try {
			await resetPassword({ token: params.get('token') || '', new_password: password })
			setMessage('Password reset successful. You can now login.')
		} catch (e) {
			setError('Failed to reset password')
		}
	}
	return (
		<>
			<div className="max-w-md mx-auto px-4 py-12">
				<h2 className="text-2xl font-semibold mb-6">Reset Password</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input type="password" className="w-full border rounded px-3 py-2" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required />
					<button className="w-full bg-gray-900 text-white py-2 rounded">Reset</button>
					{message && <div className="text-green-600 text-sm">{message}</div>}
					{error && <div className="text-red-600 text-sm">{error}</div>}
				</form>
			</div>
		</>
	)
}

