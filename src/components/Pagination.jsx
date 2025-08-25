export default function Pagination({ page, setPage, hasNext, hasPrev }) {
	return (
		<div className="flex items-center justify-center gap-3 mt-8">
			<button disabled={!hasPrev} onClick={()=>setPage(page-1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
			<span className="text-sm text-gray-600">Page {page}</span>
			<button disabled={!hasNext} onClick={()=>setPage(page+1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
		</div>
	)
}
