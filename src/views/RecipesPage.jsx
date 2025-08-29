import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listCategories, listRecipes } from "../api/recipes";
import RecipeCard from "../components/RecipeCard";
import { getAccessToken } from "../api/client";
import Pagination from "../components/Pagination";

export default function RecipesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [params, setParams] = useSearchParams();
  const [selectedCat, setSelectedCat] = useState(params.get("category") || "");

  const { data: cats } = useQuery({
    queryKey: ["recipe-cats"],
    queryFn: listCategories,
  });
  const { data, refetch } = useQuery({
    queryKey: ["recipes", { page, search, ordering }],
    queryFn: () => listRecipes({ page, search, ordering }),
  });

  useEffect(() => {
    setPage(1);
    refetch();
  }, [search, ordering]);

  useEffect(() => {
    setParams((p) => {
      selectedCat ? p.set("category", selectedCat) : p.delete("category");
      return p;
    });
  }, [selectedCat]);

  const filteredResults = useMemo(() => {
    if (!selectedCat) return data?.results || [];
    return (data?.results || []).filter((r) => r.category === selectedCat);
  }, [data, selectedCat]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">🍳 Recipes</h2>
        <div className="flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search recipes..."
            className="border rounded-lg px-4 py-2 w-64 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="-created_at">Newest</option>
            <option value="average_rating">Rating (Low→High)</option>
            <option value="-average_rating">Rating (High→Low)</option>
          </select>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        <button
          onClick={() => setSelectedCat("")}
          className={`px-4 py-2 rounded-full border transition ${
            selectedCat === ""
              ? "bg-indigo-600 text-white shadow"
              : "hover:bg-gray-100"
          }`}
        >
          All
        </button>
        {cats?.results?.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(c.id)}
            className={`px-4 py-2 rounded-full border transition whitespace-nowrap ${
              selectedCat === c.id
                ? "bg-indigo-600 text-white shadow"
                : "hover:bg-gray-100"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Recipes grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredResults.map((r) => (
          <RecipeCard key={r.id} {...r} />
        ))}
      </div>

      {/* Add Recipe button */}
      {getAccessToken() && (
        <div className="mt-10 text-center">
          <a
            href="/recipes/new"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition"
          >
            ➕ Add Recipe
          </a>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-12">
        <Pagination
          page={page}
          setPage={setPage}
          hasNext={Boolean(data?.next)}
          hasPrev={Boolean(data?.previous)}
        />
      </div>
    </section>
  );
}



