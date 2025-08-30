import api from './client'

export async function listBlogCategories() {
	const { data } = await api.get('/blogs/blogs/categories/') 
	return data
}

export async function listBlogs(params = {}) {
    const { page = 1, search = '', ordering = '-created_at', category, limit } = params
    const queryParams = { page, search, ordering }
    if (category) queryParams.category = category
    if (limit) queryParams.limit = limit
    const { data } = await api.get('/blogs/blogs/', { params: queryParams })
    return data
}

export async function getBlog(id) {
	const { data } = await api.get(`/blogs/blogs/${id}/`)  
	return data
}

export async function listComments(blogId) {
	const { data } = await api.get('/blogs/blogs/comments/', { params: { blog: blogId } })
	return data
}

export async function incrementBlogView(id) {
	const { data } = await api.post(`/blogs/blogs/${id}/increment_view/`)  
	return data
}

export async function createBlog(payload) {
	const { data } = await api.post('/blogs/blogs/', payload)  
	return data
}

export async function updateBlog(id, payload) {
	const { data } = await api.patch(`/blogs/blogs/${id}/`, payload)  
	return data
}

export async function deleteBlog(id) {
	await api.delete(`/blogs/blogs/${id}/`)  
	return { ok: true }
}

export async function createComment(payload) {
	const { data } = await api.post('/blogs/blogs/comments/', payload) 
	return data
}