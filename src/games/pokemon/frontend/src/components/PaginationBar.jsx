import React from 'react'

export default function PaginationBar({ pagination, onPrev, onNext }) {
  if (!pagination) return null
  const page = pagination.page || 1
  const totalPages = pagination.totalPages || 1
  const total = pagination.total ?? 0

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
      <button
        type="button"
        onClick={onPrev}
        disabled={page <= 1}
        className="px-4 py-2 bg-poke-blue rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
      >
        Previous
      </button>
      <span className="text-sm text-gray-300">
        Page {page} of {totalPages} · {total} total
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages}
        className="px-4 py-2 bg-poke-blue rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
      >
        Next
      </button>
    </div>
  )
}
