import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';

export default function BlogCard({ blog, index }) {
  const slug = blog.slug || blog.id || blog.title?.toLowerCase().replace(/\s+/g, '-');
  const title = blog.title || blog.meta_title || 'Untitled';
  const description = blog.meta_description || blog.description || blog.excerpt || '';
  const image = blog.featured_image || blog.image || blog.thumbnail || '';
  const author = blog.author || blog.author_name || 'Farmlyt AI';
  const date = blog.published_at || blog.created_at || blog.date || '';
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <motion.article
      itemScope
      itemType="https://schema.org/BlogPosting"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link to={`/blog/${slug}`} className="group block h-full" itemProp="url">
        <div className="h-full bg-white dark:bg-gray-800 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/50 overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/20 transition-all duration-300 flex flex-col">
          <div className="relative overflow-hidden aspect-[16/10] bg-gray-100 dark:bg-gray-700" itemProp="image" itemScope itemType="https://schema.org/ImageObject">
            {image ? (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                itemProp="url"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                <span className="text-4xl font-bold opacity-30">F</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex-1 p-5 flex flex-col">
            <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2" itemProp="name">
              {title}
            </h3>
            {description && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1" itemProp="description">
                {description}
              </p>
            )}
            <div className="mt-4 flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-1" itemProp="author" itemScope itemType="https://schema.org/Person">
                <User size={11} />
                <span itemProp="name">{author}</span>
              </span>
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  <time dateTime={date} itemProp="datePublished">{formattedDate}</time>
                </span>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-100 dark:border-emerald-900/50">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all duration-200">
                Read More
                <ArrowRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
