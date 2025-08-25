import axios from 'axios'
import { API_BASE_URL } from '../config'

const accessTokenKey = 'fl_access'
const refreshTokenKey = 'fl_refresh'

export function getAccessToken() {
	return localStorage.getItem(accessTokenKey)
}

export function setTokens({ access, refresh }) {
	if (access) localStorage.setItem(accessTokenKey, access)
	if (refresh) localStorage.setItem(refreshTokenKey, refresh)
}

export function clearTokens() {
	localStorage.removeItem(accessTokenKey)
	localStorage.removeItem(refreshTokenKey)
}

const api = axios.create({
	baseURL: `${API_BASE_URL}/api`,
})

api.interceptors.request.use((config) => {
	const token = getAccessToken()
	if (token) config.headers.Authorization = `Bearer ${token}`
	return config
})

let isRefreshing = false
let pendingQueue = []

api.interceptors.response.use(
	(res) => res,
	async (error) => {
		const original = error.config
		if (error.response && error.response.status === 401 && !original._retry) {
			original._retry = true
			const refresh = localStorage.getItem(refreshTokenKey)
			if (!refresh) {
				clearTokens()
				return Promise.reject(error)
			}
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					pendingQueue.push({ resolve, reject })
				}).then((token) => {
					original.headers.Authorization = `Bearer ${token}`
					return api(original)
				})
			}
			isRefreshing = true
			try {
				const { data } = await axios.post(`${API_BASE_URL}/api/auth/token/refresh/`, { refresh })
				setTokens({ access: data.access })
				api.defaults.headers.common.Authorization = `Bearer ${data.access}`
				pendingQueue.forEach((p) => p.resolve(data.access))
				pendingQueue = []
				return api(original)
			} catch (e) {
				clearTokens()
				pendingQueue.forEach((p) => p.reject(e))
				pendingQueue = []
				return Promise.reject(e)
			} finally {
				isRefreshing = false
			}
		}
		return Promise.reject(error)
	}
)

export default api


