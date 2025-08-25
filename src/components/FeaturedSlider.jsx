import RecipeCard from './RecipeCard'

export default function FeaturedCards({ items = [] }) {
  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((it) => (
          <div
            key={it.id}
            className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
          >
            {/* Card hover overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

            {/* Actual Recipe Card */}
            <div className="relative z-20">
              <RecipeCard {...it} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
