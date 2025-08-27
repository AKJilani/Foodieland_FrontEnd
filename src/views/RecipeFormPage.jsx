import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createRecipe, getRecipe, updateRecipe, listCategories, deleteRecipe } from '../api/recipes'

export default function RecipeFormPage({ mode }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = mode === 'edit'

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
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
        setImage(r.image || '')
        setIngredients(Array.isArray(r.ingredients) ? r.ingredients.join('\n') : '')
        setSteps(Array.isArray(r.preparation_steps) ? r.preparation_steps.join('\n') : '')
        setCategory(r.category || '')
      })
    }
  }, [isEdit, id])

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      title,
      description,
      image,
      ingredients: ingredients.split('\n').filter(Boolean),
      preparation_steps: steps.split('\n').filter(Boolean),
      category: category || null,
    }
    if (isEdit) {
      await updateRecipe(id, payload)
      navigate(`/recipes/${id}`)
    } else {
      const r = await createRecipe(payload)
      navigate(`/recipes/${r.id}`)
    }
  }

  async function handleDelete() {
    if (confirm('Delete this recipe?')) {
      await deleteRecipe(id)
      navigate('/recipes')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-6">
          {isEdit ? 'Edit Recipe' : 'Add Recipe'}
        </h2>

        {/* Image preview */}
        {image && (
          <div className="mb-4">
            <img
              src={image}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Image URL"
              value={image}
              onChange={e => setImage(e.target.value)}
            />
          </div>

          <div>
            <textarea
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              rows="3"
              placeholder="Short description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">No category</option>
              {cats.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingredients (one per line)
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows="5"
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Steps (one per line)
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows="5"
              value={steps}
              onChange={e => setSteps(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow transition">
              {isEdit ? 'Save Changes' : 'Create Recipe'}
            </button>
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2 rounded-lg border text-red-600 border-red-600 hover:bg-red-50 transition"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
