import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://farmlyt.ai';
const API_URL = 'https://aislyn.in/admin/admin/farmly_api.php';

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/about', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services', priority: '0.8', changefreq: 'monthly' },
  { loc: '/features', priority: '0.8', changefreq: 'monthly' },
  { loc: '/research', priority: '0.7', changefreq: 'monthly' },
  { loc: '/predict', priority: '0.7', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
  { loc: '/blogs', priority: '0.9', changefreq: 'weekly' },
  { loc: '/privacy', priority: '0.4', changefreq: 'yearly' },
  { loc: '/terms', priority: '0.4', changefreq: 'yearly' },
  { loc: '/cookies', priority: '0.3', changefreq: 'yearly' },
];

async function generateSitemap() {
  let blogUrls = [];

  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const blogs = data?.blogs || [];
    blogUrls = blogs.map((b) => ({
      loc: `/blog/${b.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: b.published_at || b.created_at || '',
    }));
  } catch (e) {
    console.warn('Failed to fetch blogs for sitemap:', e.message);
  }

  const urls = [...staticPages, ...blogUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const outPath = resolve(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf-8');
  console.log(`Sitemap generated: ${outPath} (${urls.length} URLs)`);
}

generateSitemap();
