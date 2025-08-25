import api from './client'

export async function listBlogCategories() {
	const { data } = await api.get('/blogs/categories/')
	return data
}

export async function listBlogs(params = {}) {
	const { page = 1, search = '', ordering = '-created_at' } = params
	const { data } = await api.get('/blogs/', { params: { page, search, ordering } })
	return data
}

export async function getBlog(id) {
	const { data } = await api.get(`/blogs/${id}/`)
	return data
}

export async function listComments(blogId) {
	const { data } = await api.get('/blogs/comments/', { params: { blog: blogId } })
	return data
}

export async function incrementBlogView(id) {
	const { data } = await api.post(`/blogs/${id}/increment_view/`)
	return data
}

export async function createBlog(payload) {
	const { data } = await api.post('/blogs/', payload)
	return data
}

export async function updateBlog(id, payload) {
	const { data } = await api.patch(`/blogs/${id}/`, payload)
	return data
}

export async function deleteBlog(id) {
	await api.delete(`/blogs/${id}/`)
	return { ok: true }
}

export async function createComment(payload) {
	const { data } = await api.post('/blogs/comments/', payload)
	return data
}