import { cn } from '../../utils/cn';

export default function Skeleton({ className, variant = 'text', ...props }) {
  const variants = {
    text: 'h-4 w-full rounded',
    title: 'h-8 w-3/4 rounded',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-48 w-full rounded-2xl',
    button: 'h-10 w-24 rounded-xl',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        variants[variant] || variants.text,
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4 border border-gray-100 dark:border-gray-700">
      <Skeleton variant="avatar" />
      <Skeleton variant="title" />
      <Skeleton />
      <Skeleton />
      <Skeleton className="w-1/2" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20 space-y-8">
      <Skeleton variant="title" className="mx-auto" />
      <Skeleton className="w-2/3 mx-auto" />
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
