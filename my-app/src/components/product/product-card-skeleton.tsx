// ProductCardSkeleton loading component for Pawfectly Handmade

export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-muted" />

      {/* Content skeleton */}
      <div className="p-4">
        <div className="h-6 bg-muted rounded mb-2 w-3/4" />
        <div className="h-4 bg-muted rounded w-1/3 mb-4" />

        {/* Price skeleton */}
        <div className="h-5 bg-muted rounded w-1/4" />

        {/* Button skeleton */}
        <div className="h-10 bg-muted rounded mt-4 w-full opacity-0 md:opacity-100" />
      </div>
    </div>
  )
}
