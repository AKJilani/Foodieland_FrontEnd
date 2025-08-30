import api, { setTokens, clearTokens } from './client'

export async function registerUser(formData) {
    const { data } = await api.post('/auth/register/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
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

export async function getUserById(id) {
  const { data } = await api.get(`/users/${id}/`);
  return data;
}

export async function listUsers(params = {}) {
    const { data } = await api.get('/users/', { params })
    return data
}

export async function fetchMe() {
    const { data } = await api.get('/auth/me/')
    return data
}

// export async function updateMe(payload) {
//     const { data } = await api.patch('/auth/me/', payload)
//     return data
// }

export async function updateMe(payload) {
    const config = {}
    if (payload instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' }
    }
    const { data } = await api.patch('/auth/me/', payload, config)
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

export async function resetPassword({ token, uidb64, new_password }) {
	const payload = { token, uidb64, new_password }
	const { data } = await api.post('/auth/reset-password/', payload)
	return data
}