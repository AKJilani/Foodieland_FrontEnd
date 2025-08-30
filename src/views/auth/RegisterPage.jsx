import { useState, useRef } from 'react'
import { registerUser } from '../../api/auth'

export default function RegisterPage() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [bio, setBio] = useState('')
	const [profilePicture, setProfilePicture] = useState(null)
	const [previewUrl, setPreviewUrl] = useState(null)
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const fileInputRef = useRef(null)

	const handleFileChange = (e) => {
		const file = e.target.files[0]
		if (file) {
			if (file.size > 5 * 1024 * 1024) { // 5MB limit
				setError('Profile picture must be less than 5MB')
				return
			}
			if (!file.type.startsWith('image/')) {
				setError('Please select a valid image file')
				return
			}
			setProfilePicture(file)
			setPreviewUrl(URL.createObjectURL(file))
			setError('')
		}
	}

	const removeImage = () => {
		setProfilePicture(null)
		setPreviewUrl(null)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	async function handleSubmit(e) {
		e.preventDefault()
		setMessage('')
		setError('')
		setLoading(true)

		try {
			const formData = new FormData()
			formData.append('name', name)
			formData.append('email', email)
			formData.append('password', password)
			if (bio.trim()) formData.append('bio', bio)
			if (profilePicture) formData.append('profile_picture', profilePicture)

			await registerUser(formData)
			setMessage('Registration successful! Please check your email to verify your account.')
		} catch (err) {
			setError(
				err?.response?.data?.detail ||
				err?.response?.data?.email?.[0] ||
				err?.response?.data?.password?.[0] ||
				err?.response?.data?.profile_picture?.[0] ||
				'Registration failed. Please try again.'
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="bg-gradient-to-r from-indigo-500 to-purple-600 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
						<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Join Us Today</h1>
					<p className="text-gray-600">Create your account and get started</p>
				</div>

				{/* Register Card */}
				<div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
					<div onSubmit={handleSubmit}>
						{/* Profile Picture Upload */}
						<div className="text-center mb-6">
							<div className="relative inline-block">
								{previewUrl ? (
									<div className="relative">
										<img
											src={previewUrl}
											alt="Profile preview"
											className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 shadow-md"
										/>
										<button
											type="button"
											onClick={removeImage}
											className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg"
										>
											×
										</button>
									</div>
								) : (
									<div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-4 border-indigo-100 shadow-md flex items-center justify-center">
										<svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
										</svg>
									</div>
								)}
							</div>
							<div className="mt-3">
								<label className="cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-indigo-200">
									{previewUrl ? 'Change Picture' : 'Add Picture'}
									<input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										onChange={handleFileChange}
										className="hidden"
									/>
								</label>
								<p className="text-xs text-gray-500 mt-1">Optional • Max 5MB</p>
							</div>
						</div>

						{/* Input Fields */}
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
								<input
									className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
									placeholder="Enter your full name"
									value={name}
									onChange={e => setName(e.target.value)}
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
								<input
									type="email"
									className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
									placeholder="Enter your email"
									value={email}
									onChange={e => setEmail(e.target.value)}
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
								<input
									type="password"
									className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
									placeholder="Create a strong password"
									value={password}
									onChange={e => setPassword(e.target.value)}
									required
									minLength={8}
								/>
								<p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Bio <span className="text-gray-400 text-xs">(Optional)</span></label>
								<textarea
									className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
									placeholder="Tell us a bit about yourself..."
									value={bio}
									onChange={e => setBio(e.target.value)}
									rows={3}
									maxLength={500}
								/>
								<div className="text-xs text-gray-500 mt-1 text-right">{bio.length}/500</div>
							</div>
						</div>

						{/* Submit Button */}
						<button
							onClick={handleSubmit}
							disabled={loading}
							className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
						>
							{loading ? (
								<div className="flex items-center justify-center">
									<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Creating Account...
								</div>
							) : (
								'Create Account'
							)}
						</button>

						{/* Messages */}
						{message && (
							<div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
								<div className="flex items-start">
									<svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<div>{message}</div>
								</div>
							</div>
						)}

						{error && (
							<div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
								<div className="flex items-start">
									<svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<div>{error}</div>
								</div>
							</div>
						)}
					</div>

					{/* Footer Links */}
					<div className="mt-6 text-center text-sm text-gray-600">
						Already have an account?{' '}
						<a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
							Sign in here
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}