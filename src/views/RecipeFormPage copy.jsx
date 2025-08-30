import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createRecipe, getRecipe, updateRecipe, listCategories, deleteRecipe } from '../api/recipes'

export default function RecipeFormPage({ mode }) {
	const navigate = useNavigate()
	const { id } = useParams()
	const isEdit = mode === 'edit'

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [imageFile, setImageFile] = useState(null)
	const [ingredients, setIngredients] = useState('')
	const [steps, setSteps] = useState('')
	const [category, setCategory] = useState('')
	const [cats, setCats] = useState([])

	useEffect(() => {
		listCategories().then(d => setCats(d.results || []))
		if (isEdit && id) {
			getRecipe(id).then(r => {
				setTitle(r.title || '')
				setDescription(r.description || '')
				setCategory(r.category || '')
				setIngredients(Array.isArray(r.ingredients) ? r.ingredients.join('\n') : '')
				setSteps(Array.isArray(r.preparation_steps) ? r.preparation_steps.join('\n') : '')
			})
		}
	}, [isEdit, id])

	async function handleSubmit(e) {
		e.preventDefault()
		const formData = new FormData()
		formData.append("title", title)
		formData.append("description", description)
		formData.append("category", category || "")
		formData.append("ingredients", JSON.stringify(ingredients.split('\n').filter(Boolean)))
		formData.append("preparation_steps", JSON.stringify(steps.split('\n').filter(Boolean)))

		if (imageFile) {
			formData.append("image", imageFile)
		}

		if (isEdit) {
			await updateRecipe(id, formData, true)
			navigate(`/recipes/${id}`)
		} else {
			const r = await createRecipe(formData, true)
			navigate(`/recipes/${r.id}`)
		}
	}

	return (
		<div className="max-w-2xl mx-auto px-4 py-12">
			<h2 className="text-2xl font-semibold mb-6">{isEdit ? 'Edit Recipe' : 'Add Recipe'}</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input className="w-full border rounded px-3 py-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
				<input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
				<textarea className="w-full border rounded px-3 py-2" rows="3" placeholder="Short description" value={description} onChange={e => setDescription(e.target.value)} />
				<select className="w-full border rounded px-3 py-2" value={category} onChange={e => setCategory(e.target.value)}>
					<option value="">No category</option>
					{cats.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
				</select>
				<div>
					<label className="block text-sm font-medium mb-1">Ingredients (one per line)</label>
					<textarea className="w-full border rounded px-3 py-2" rows="5" value={ingredients} onChange={e => setIngredients(e.target.value)} />
				</div>
				<div>
					<label className="block text-sm font-medium mb-1">Steps (one per line)</label>
					<textarea className="w-full border rounded px-3 py-2" rows="5" value={steps} onChange={e => setSteps(e.target.value)} />
				</div>
				<div className="flex items-center gap-3">
					<button className="bg-gray-900 text-white px-4 py-2 rounded">{isEdit ? 'Save' : 'Create'}</button>
					{isEdit && <button type="button" onClick={async () => {
						if (confirm('Delete this recipe?')) {
							await deleteRecipe(id)
							navigate('/recipes')
						}
					}} className="px-4 py-2 rounded border">Delete</button>}
				</div>
			</form>
		</div>
	)
}