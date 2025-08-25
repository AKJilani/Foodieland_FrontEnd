import api from './client'

export async function listCategories() {
	const { data } = await api.get('/recipes/categories/')
	return data
}

export async function listRecipes(params = {}) {
	const { page = 1, search = '', ordering = '-created_at' } = params
	const { data } = await api.get('/recipes/', { params: { page, search, ordering } })
	return data
}

export async function getRecipe(id) {
	const { data } = await api.get(`/recipes/${id}/`)
	return data
}

export async function createRecipe(payload) {
	const { data } = await api.post('/recipes/', payload)
	return data
}

export async function updateRecipe(id, payload) {
	const { data } = await api.patch(`/recipes/${id}/`, payload)
	return data
}

export async function deleteRecipe(id) {
	await api.delete(`/recipes/${id}/`)
	return { ok: true }
}

export async function listMyRatings() {
	const { data } = await api.get('/recipes/my/ratings/')
	return data
}

export async function createRating(payload) {
	const { data } = await api.post('/recipes/my/ratings/', payload)
	return data
}

export async function updateRating(id, payload) {
	const { data } = await api.patch(`/recipes/my/ratings/${id}/`, payload)
	return data
}

export async function listMyFavorites() {
	const { data } = await api.get('/recipes/my/favorites/')
	return data
}

export async function addFavorite(payload) {
	const { data } = await api.post('/recipes/my/favorites/', payload)
	return data
}

export async function removeFavorite(id) {
	await api.delete(`/recipes/my/favorites/${id}/`)
	return { ok: true }
}


