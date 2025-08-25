export default function CategoryCard({ id, name, color = '#eef2ff' }) {
  return (
    <a
      href={`/recipes?category=${id || ''}`}
      className={`block p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-2`}
      style={{ backgroundColor: color }}
    >
      <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">Category</div>
      <div className="text-lg font-bold text-gray-900 mt-2">{name}</div>
      <div className="mt-3 h-1 w-10 rounded-full bg-gray-900"></div>
    </a>
  )
}