'use client'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <h2 className="text-xl font-semibold text-red-600">Something went wrong!</h2>
      <p className="text-slate-600">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  )
}
