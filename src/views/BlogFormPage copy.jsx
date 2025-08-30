import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createBlog, getBlog, updateBlog, deleteBlog, listBlogCategories } from '../api/blogs'

export default function BlogFormPage({ mode }) {
	const navigate = useNavigate()
	const { id } = useParams()
	const isEdit = mode === 'edit'
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [featured_image, setImage] = useState('')
	const [content, setContent] = useState('')
	const [category, setCategory] = useState('')
	const [cats, setCats] = useState([])

	useEffect(()=>{
		listBlogCategories().then(d=> setCats(d.results||[]))
		if(isEdit && id){
			getBlog(id).then(b=>{
				setTitle(b.title||'')
				setDescription(b.description||'')
				setImage(b.featured_image||'')
				setContent(b.content||'')
				setCategory(b.category||'')
			})
		}
	},[isEdit, id])

	async function handleSubmit(e){
		e.preventDefault()
		const payload = { title, description, content, featured_image, category: category || null, is_published: true }
		if(isEdit){
			await updateBlog(id, payload)
			navigate(`/blogs/${id}`)
		}else{
			const b = await createBlog(payload)
			navigate(`/blogs/${b.id}`)
		}
	}

	async function handleDelete(){
		if(confirm('Delete this blog?')){
			await deleteBlog(id)
			navigate('/blogs')
		}
	}

	return (
		<>
			<div className="max-w-2xl mx-auto px-4 py-12">
				<h2 className="text-2xl font-semibold mb-6">{isEdit? 'Edit Blog' : 'Add Blog'}</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input className="w-full border rounded px-3 py-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
					<input className="w-full border rounded px-3 py-2" placeholder="Featured image URL" value={featured_image} onChange={e=>setImage(e.target.value)} />
					<textarea className="w-full border rounded px-3 py-2" rows="3" placeholder="Short description" value={description} onChange={e=>setDescription(e.target.value)} />
					<select className="w-full border rounded px-3 py-2" value={category} onChange={e=>setCategory(e.target.value)}>
						<option value="">No category</option>
						{cats.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
					</select>
					<div>
						<label className="block text-sm font-medium mb-1">Content</label>
						<textarea className="w-full border rounded px-3 py-2" rows="10" value={content} onChange={e=>setContent(e.target.value)} />
					</div>
					<div className="flex items-center gap-3">
						<button className="bg-gray-900 text-white px-4 py-2 rounded">{isEdit? 'Save' : 'Create'}</button>
						{isEdit && <button type="button" onClick={handleDelete} className="px-4 py-2 rounded border">Delete</button>}
					</div>
				</form>
			</div>
		</>
	)
}


