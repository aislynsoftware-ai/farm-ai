export default function Skeleton({ className = '', count = 1 }) {
  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`animate-pulse rounded-xl bg-gray-800/60 border border-gray-700/50 ${className}`}>
            <div className="h-full w-full bg-gray-700/30 rounded-xl" />
          </div>
        ))}
      </>
    );
  }
  return (
    <div className={`animate-pulse rounded-xl bg-gray-800/60 border border-gray-700/50 ${className}`}>
      <div className="h-full w-full bg-gray-700/30 rounded-xl" />
    </div>
  );
}

export function SkeletonRow({ cols = 6 }) {
  return (
    <tr className="border-b border-gray-700/50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-3"><div className="h-4 bg-gray-700/50 rounded w-full animate-pulse" /></td>
      ))}
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 overflow-hidden animate-pulse">
      <div className="h-28 bg-gray-700/40" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-700/50 rounded w-3/4" />
        <div className="h-3 bg-gray-700/40 rounded w-1/2" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl p-5 space-y-3 border border-gray-700 bg-gray-800">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-6">
      <Skeleton className="h-6 w-1/2 mx-auto" />
      <Skeleton className="h-3 w-2/3 mx-auto" />
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

export function DetailHeaderSkeleton() {
  return (
    <div className="rounded-2xl p-6 lg:p-8 mb-8 bg-gray-800/60 border border-gray-700/50">
      <Skeleton className="h-40 w-full mb-4" />
      <Skeleton className="h-3 w-16 mb-2" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-3 w-2/3 mt-2" />
    </div>
  );
}

export function GridCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-700/50 bg-gray-800/60 overflow-hidden">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function DashboardWelcomeSkeleton() {
  return (
    <div className="rounded-2xl bg-gray-800/60 border border-gray-700/50 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
    </div>
  );
}
