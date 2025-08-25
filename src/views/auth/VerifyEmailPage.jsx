import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { verifyEmail } from '../../api/auth'

export default function VerifyEmailPage() {
	const [params] = useSearchParams()
	const [status, setStatus] = useState('verifying')
	const [errorDetails, setErrorDetails] = useState('')

	useEffect(() => {
		const verifyEmailWithFirebase = async () => {
			try {
				// Get URL parameters
				const mode = params.get('mode')
				const oobCode = params.get('oobCode')
				
				// Log params for debugging
				console.log('Verification Parameters:', { mode, oobCode })
				
				if (!oobCode) {
					setStatus('missing')
					setErrorDetails('No verification code found in URL')
					return
				}

				// Send verification request
				const response = await verifyEmail(oobCode)
				console.log('Verification Response:', response)
				
				setStatus('success')
				// After successful verification, redirect to login
				setTimeout(() => {
					window.location.href = '/login'
				}, 3000)
			} catch (error) {
				console.error('Verification Error:', error)
				setStatus('error')
				// Handle array of ErrorDetail objects or single error message
				const errorMessage = error?.response?.data?.[0]?.string || 
					error?.response?.data?.detail ||
					error?.message ||
					'Failed to verify email. Please try again.'
				setErrorDetails(errorMessage)
			}
		}
		verifyEmailWithFirebase()
	}, [params])

	return (
		<>
			<div className="max-w-md mx-auto px-4 py-12">
				{status === 'verifying' && (
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
						<p className="text-gray-600">Verifying your email address...</p>
					</div>
				)}
				{status === 'success' && (
					<div className="text-center">
						<div className="bg-green-100 p-4 rounded-lg mb-4">
							<svg className="h-12 w-12 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
							</svg>
							<p className="text-green-600 font-semibold text-lg">Email verified successfully!</p>
							<p className="text-gray-600 mt-2">You will be redirected to login in 3 seconds...</p>
						</div>
					</div>
				)}
				{status === 'missing' && (
					<div className="text-center">
						<div className="bg-yellow-100 p-4 rounded-lg">
							<svg className="h-12 w-12 text-yellow-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
							</svg>
							<p className="text-yellow-800 font-semibold mb-2">Invalid Verification Link</p>
							<p className="text-gray-600">The verification link appears to be invalid. Please make sure you're using the complete link from your email.</p>
							{errorDetails && (
								<p className="text-sm text-yellow-700 mt-2">{errorDetails}</p>
							)}
							<button 
								onClick={() => window.location.reload()} 
								className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
							>
								Try Again
							</button>
						</div>
					</div>
				)}
				{status === 'error' && (
					<div className="text-center">
						<div className="bg-red-100 p-4 rounded-lg">
							<svg className="h-12 w-12 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
							<p className="text-red-600 font-semibold mb-2">Verification Failed</p>
							<p className="text-gray-600">There was a problem verifying your email.</p>
							{errorDetails && (
								<p className="text-sm text-red-700 mt-2">{errorDetails}</p>
							)}
							<div className="mt-4 space-y-2">
								<button 
									onClick={() => window.location.reload()} 
									className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
								>
									Try Again
								</button>
								<p className="text-sm text-gray-500">
									If the problem persists, you may need to register again to get a new verification link.
								</p>
							</div>
						</div>
					</div>
				)}
				{status === 'error' && (
					<div className="text-center">
						<div className="bg-red-100 p-4 rounded-lg">
							<svg className="h-12 w-12 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
							<p className="text-red-600 font-semibold mb-2">Verification Failed</p>
							{errorDetails && (
								<p className="text-sm text-red-700 mt-2 whitespace-pre-wrap">{errorDetails}</p>
							)}
							<div className="mt-4 space-y-2">
								<button 
									onClick={() => window.location.reload()} 
									className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
								>
									Try Again
								</button>
								<p className="text-sm text-gray-500">
									If the problem persists, please contact support.
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	)
}


