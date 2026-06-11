import { cn } from '../../utils/cn';

export default function Skeleton({ className, variant = 'text', ...props }) {
  const variants = {
    text: 'h-3 w-full rounded',
    title: 'h-6 w-3/4 rounded',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-40 w-full rounded-2xl',
    button: 'h-9 w-20 rounded-xl',
    image: 'h-44 w-full rounded-2xl',
    badge: 'h-5 w-16 rounded-full',
    icon: 'h-12 w-12 rounded-xl',
  };

  return (
    <div
      className={cn(
        'animate-pulse-fast bg-gray-200 dark:bg-gray-700',
        variants[variant] || variants.text,
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 space-y-3 border border-gray-100 dark:border-gray-700">
      <Skeleton variant="avatar" />
      <Skeleton variant="title" />
      <Skeleton />
      <Skeleton />
      <Skeleton className="w-1/3" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-6">
      <Skeleton variant="title" className="mx-auto" />
      <Skeleton className="w-2/3 mx-auto" />
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600/20 via-green-700/20 to-blue-800/20 p-6 lg:p-8 mb-8">
      <Skeleton variant="image" className="w-full h-40 mb-4" />
      <Skeleton className="w-16 h-3 mb-2" />
      <Skeleton variant="title" className="w-1/2" />
      <Skeleton className="w-2/3 mt-2" />
    </div>
  );
}

export function GridCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden">
      <Skeleton variant="image" className="h-40 rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton variant="title" />
        <Skeleton className="w-1/2" />
      </div>
    </div>
  );
}

export function DashboardWelcomeSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600/20 via-green-700/20 to-blue-800/20 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton variant="icon" />
          <div className="space-y-2">
            <Skeleton variant="title" className="w-48" />
            <Skeleton className="w-32" />
          </div>
        </div>
        <Skeleton className="w-24 h-10 rounded-xl" />
      </div>
    </div>
  );
}
