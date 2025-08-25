import api, { setTokens, clearTokens } from './client'

export async function registerUser({ name, email, password }) {
	const { data } = await api.post('/auth/register/', { name, email, password })
	return data
}

export async function loginUser({ email, password }) {
	const { data } = await api.post('/auth/token/', { email, password })
	setTokens({ access: data.access, refresh: data.refresh })
	return data
}

export function logoutUser() {
	clearTokens()
}

export async function fetchMe() {
	const { data } = await api.get('/auth/me/')
	return data
}

export async function updateMe(payload) {
	const { data } = await api.patch('/auth/me/', payload)
	return data
}


// Use Firebase endpoint for email verification
export async function verifyEmail(oobCode) {
    const { data } = await api.post('/auth/firebase-verify-email/', { 
        oobCode: oobCode,
        mode: 'verifyEmail'
    })
    return data
}

export async function requestPasswordReset(email) {
	const { data } = await api.post('/auth/request-password-reset/', { email })
	return data
}

export async function resetPassword({ token, new_password }) {
	const { data } = await api.post('/auth/reset-password/', { token, new_password })
	return data
}


