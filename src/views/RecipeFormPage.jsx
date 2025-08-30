import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createRecipe, getRecipe, updateRecipe, listCategories, deleteRecipe } from '../api/recipes'

export default function RecipeFormPage({ mode }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = mode === 'edit'

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [nutritionInfo, setNutritionInfo] = useState({
    calories: '',
    carbohydrates: '',
    cholesterol: '',
    protein: '',
    fat: '',
    fiber: '',
  })
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
        setNutritionInfo(r.nutrition_info || {
          calories: '',
          carbohydrates: '',
          cholesterol: '',
          protein: '',
          fat: '',
          fiber: ''
        })
        setIngredients(Array.isArray(r.ingredients) ? r.ingredients.join('\n') : '')
        setSteps(Array.isArray(r.preparation_steps) ? r.preparation_steps.join('\n') : '')
        setCategory(r.category || '')
      })
    }
  }, [isEdit, id])

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("nutrition_info", JSON.stringify(nutritionInfo))
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              onChange={e => setImageFile(e.target.files[0])}
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

          {/* Nutritional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nutritional Information
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                {key:'calories', label: 'Calories', unit:'kcal'},
                {key:'carbohydrates', label: 'Carbohydrates', unit:'g'},
                {key:'cholesterol', label: 'Cholesterol', unit:'mg'},
                {key:'protein', label: 'Protein', unit:'g'},
                {key:'fat', label: 'Fat', unit:'g'},
                {key:'fiber', label: 'Fiber', unit:'g'}
              ].map(({key, label, unit}) => (
                <div key={key} className="flex items-center border rounded-lg px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    className="w-full outline-none"
                    placeholder={label}
                    value={nutritionInfo[key]}
                    onChange={e => 
                      setNutritionInfo({ ...nutritionInfo, [key]: e.target.value })
                    }
                  />
                  <span className="ml-2 text-gray-500">{unit}</span>
                </div>
              ))}
            </div>
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
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
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
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
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