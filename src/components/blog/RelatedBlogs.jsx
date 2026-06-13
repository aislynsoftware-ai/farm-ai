import BlogCard from './BlogCard';

export default function RelatedBlogs({ currentSlug, blogs, max = 3 }) {
  const related = (blogs || []).filter((b) => {
    const s = b.slug || b.id || b.title?.toLowerCase().replace(/\s+/g, '-');
    return s !== currentSlug;
  }).slice(0, max);

  if (related.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Related Articles</h2>
      <div className="grid md:grid-cols-3 gap-5">
        {related.map((blog, i) => (
          <BlogCard key={blog.slug || blog.id || i} blog={blog} index={i} />
        ))}
      </div>
    </div>
  );
}
