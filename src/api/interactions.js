import api from './client'

export async function sendContactMessage(payload) {
	const { data } = await api.post('/interactions/messages/', payload)
	return data
}

export async function listMyMessages() {
	const { data } = await api.get('/interactions/messages/')
	return data
}

export async function followUser(following) {
	const { data } = await api.post('/interactions/follows/', { following })
	return data
}

export async function unfollowUser(following) {
	const { data } = await api.post('/interactions/follows/unfollow/', { following })
	return data
}


