import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../components/layout/PageHeader';
import BlogCard from '../components/blog/BlogCard';
import { BlogGridSkeleton } from '../components/blog/BlogSkeleton';
import { getAllBlogs } from '../services/blogApi';

const PER_PAGE = 6;

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getAllBlogs();
        setBlogs(data);
      } catch (e) {
        setError(e.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = blogs.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (b.title || '').toLowerCase().includes(q) ||
           (b.meta_description || b.description || '').toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => { setPage(1); }, [search]);

  return (
    <>
      <Helmet>
        <title>Blogs - Farmlyt AI | Smart Agriculture Insights</title>
        <meta name="description" content="Explore Farmlyt AI blogs on smart agriculture, AI-powered crop disease detection, plant identification, and farming technology insights." />
        <meta property="og:title" content="Blogs - Farmlyt AI | Smart Agriculture Insights" />
        <meta property="og:description" content="Explore Farmlyt AI blogs on smart agriculture, AI-powered crop disease detection, plant identification, and farming technology insights." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://farmlyt.ai/blogs" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blogs - Farmlyt AI | Smart Agriculture Insights" />
        <meta name="twitter:description" content="Explore Farmlyt AI blogs on smart agriculture, AI-powered crop disease detection, plant identification, and farming technology insights." />
      </Helmet>

      <main>
        <PageHeader
          title="Blogs & Insights"
          description="Latest articles on AI-powered agriculture, plant disease detection, smart farming tips, and Farmlyt AI updates."
          gradient="from-emerald-500 via-green-500 to-teal-500"
        />

        <section className="py-8 pb-16 bg-emerald-50/30 dark:bg-emerald-950/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative max-w-md mx-auto mb-8">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300 dark:focus:border-emerald-700 transition-all"
              />
            </div>

            {loading && <BlogGridSkeleton />}

            {error && (
              <div className="text-center py-16">
                <BookOpen size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-3 px-4 py-2 text-xs font-medium rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">Try Again</button>
              </div>
            )}

            {!loading && !error && paginated.length === 0 && (
              <div className="text-center py-16">
                <BookOpen size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No blogs found{search ? ` matching "${search}"` : ''}.</p>
              </div>
            )}

            {!loading && !error && paginated.length > 0 && (
              <>
                <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {paginated.map((blog, i) => (
                    <BlogCard key={blog.slug || blog.id || i} blog={blog} index={i} />
                  ))}
                </motion.div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`min-w-[36px] h-9 rounded-xl text-xs font-semibold transition-all ${
                          p === page
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-emerald-300 dark:hover:border-emerald-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
