import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, User, Clock, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import ShareButtons from '../components/blog/ShareButtons';
import RelatedBlogs from '../components/blog/RelatedBlogs';
import { BlogDetailSkeleton } from '../components/blog/BlogSkeleton';
import { getBlogBySlug, getAllBlogs } from '../services/blogApi';

export default function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const [blogData, blogsData] = await Promise.all([
        getBlogBySlug(slug),
        getAllBlogs().catch(() => []),
      ]);
      if (!blogData) throw new Error('Blog not found');
      setBlog(blogData);
      setAllBlogs(Array.isArray(blogsData) ? blogsData : []);
    } catch (e) {
      setError(e.message || 'Failed to load blog');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { fetchBlog(); window.scrollTo(0, 0); }, [fetchBlog]);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (loading) {
    return (
      <main>
        <PageHeader title="Loading..." />
        <section className="py-8 pb-16 bg-emerald-50/30 dark:bg-emerald-950/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <BlogDetailSkeleton />
          </div>
        </section>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main>
        <PageHeader title="Blog Not Found" />
        <section className="py-8 pb-16 bg-emerald-50/30 dark:bg-emerald-950/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <BookOpen size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error || 'The blog you are looking for does not exist.'}</p>
            <Link to="/blogs" className="inline-flex items-center gap-1 px-4 py-2 text-xs font-medium rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
              <ArrowLeft size={14} />
              Back to Blogs
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const title = blog.title || blog.meta_title || 'Untitled';
  const metaDesc = blog.meta_description || blog.description || blog.excerpt || '';
  const image = blog.featured_image || blog.image || blog.thumbnail || '';
  const author = blog.author || blog.author_name || 'Farmlyt AI';
  const date = blog.published_at || blog.created_at || blog.date || '';
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const pageUrl = `https://farmlyt.ai/blog/${slug}`;
  const readingTime = blog.reading_time || blog.read_time || Math.ceil((blog.content?.length || 1000) / 1000) || 3;

  const contentFields = ['contentone', 'contenttwo', 'contentthree', 'contentfour', 'contentfive'];
  const contentSections = contentFields
    .map((k) => blog[k])
    .filter((v) => v && v.trim())
    .map((text) => {
      const trimmed = text.trim();
      const dot = trimmed.indexOf('.');
      const heading = dot > 10 && dot < 120 ? trimmed.slice(0, dot + 1) : trimmed.split(/\r?\n/)[0];
      const body = trimmed.slice(heading.length).replace(/^[\s\r\n]+/, '');
      return { heading, body };
    });

  const currentIndex = allBlogs.findIndex((b) => {
    const s = b.slug || b.id || b.title?.toLowerCase().replace(/\s+/g, '-');
    return s === slug;
  });
  const prevBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const nextBlog = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    name: title,
    author: { '@type': 'Person', name: author },
    datePublished: date,
    dateModified: blog.updated_at || date,
    image: image,
    description: metaDesc,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    publisher: {
      '@type': 'Organization',
      name: 'Farmlyt AI',
      logo: { '@type': 'ImageObject', url: 'https://farmlyt.ai/logo.png' },
    },
  };

  return (
    <article itemScope itemType="https://schema.org/BlogPosting">
      <Helmet>
        <title>{`${title} - Farmlyt AI Blog`}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={`${title} - Farmlyt AI`} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Farmlyt AI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} - Farmlyt AI`} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:site" content="@farmlytai" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500 z-[9999] transition-all duration-150" style={{ width: `${progress}%` }} />

      <main>
        <section className="relative pt-28 pb-8 lg:pt-36 lg:pb-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.08),transparent_60%)]" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/blogs" className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-4">
              <ArrowLeft size={13} />
              Back to Blogs
            </Link>
            <motion.h1
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight"
              itemProp="name headline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {title}
            </motion.h1>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5" itemProp="author" itemScope itemType="https://schema.org/Person">
                <User size={13} />
                <span itemProp="name">{author}</span>
              </span>
              {formattedDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  <time dateTime={date} itemProp="datePublished">{formattedDate}</time>
                </span>
              )}
              <span className="flex items-center gap-1.5"><Clock size={13} />{readingTime} min read</span>
            </div>
          </div>
        </section>

        <section className="pb-16 bg-emerald-50/30 dark:bg-emerald-950/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-[1fr_48px] lg:gap-8 relative">
              <div className="max-w-3xl mx-auto lg:mx-0 lg:col-start-1">
                {image && (
                  <motion.div
                    className="rounded-2xl overflow-hidden mb-8 bg-white dark:bg-gray-800 border-2 border-emerald-100 dark:border-emerald-900/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    itemProp="image"
                    itemScope
                    itemType="https://schema.org/ImageObject"
                  >
                    <img src={image} alt={title} className="w-full aspect-video object-cover" itemProp="url" />
                    <meta itemProp="width" content="1200" />
                    <meta itemProp="height" content="675" />
                  </motion.div>
                )}

                <div itemProp="articleBody">
                  {contentSections.length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/50 p-6 md:p-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400 italic">No content available.</p>
                    </div>
                  )}
                  {contentSections.map((sec, i) => (
                    <motion.div
                      key={i}
                      className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/50 p-6 md:p-8 mb-5 last:mb-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                    >
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3">{sec.heading}</h2>
                      {sec.body.split(/\r?\n\r?\n/).filter(Boolean).map((para, j) => (
                        <p key={j} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3 last:mb-0">{para.trim()}</p>
                      ))}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t-2 border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between">
                  <div className="flex gap-3">
                    {prevBlog && (() => {
                      const ps = prevBlog.slug || prevBlog.id || prevBlog.title?.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <Link to={`/blog/${ps}`} rel="prev" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border-2 border-emerald-100 dark:border-emerald-900/50 text-xs text-gray-600 dark:text-gray-300 hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-600 transition-all">
                          <ChevronLeft size={13} />
                          Previous
                        </Link>
                      );
                    })()}
                    {nextBlog && (() => {
                      const ns = nextBlog.slug || nextBlog.id || nextBlog.title?.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <Link to={`/blog/${ns}`} rel="next" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border-2 border-emerald-100 dark:border-emerald-900/50 text-xs text-gray-600 dark:text-gray-300 hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-600 transition-all">
                          Next
                          <ChevronRight size={13} />
                        </Link>
                      );
                    })()}
                  </div>
                </div>

                <RelatedBlogs currentSlug={slug} blogs={allBlogs} />
              </div>

              <aside className="hidden lg:block lg:col-start-2">
                <div className="sticky top-24">
                  <ShareButtons url={pageUrl} title={title} />
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <ShareButtons url={pageUrl} title={title} />
      </div>
    </article>
  );
}
