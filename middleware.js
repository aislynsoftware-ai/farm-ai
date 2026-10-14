const API_URL = 'https://aislyn.in/admin/admin/farmly_api.php';
const SITE_URL = 'https://www.farmlytai.in';

export const config = {
  matcher: '/blog/:slug',
};

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const slug = decodeURIComponent(url.pathname.replace('/blog/', ''));

  if (!slug) {
    return;
  }

  let blog = null;

  try {
    const apiRes = await fetch(`${API_URL}?slug=${encodeURIComponent(slug)}`);
    const data = await apiRes.json();
    blog = data?.blog || (Array.isArray(data) ? data[0] : null) || null;
  } catch {
    return;
  }

  if (!blog) {
    return;
  }

  const originRes = await fetch(request);
  let html = await originRes.text();

  const title = escapeHtml(
    blog.meta_title || blog.seo_title || blog.title || 'Farmlyt AI Blog'
  );

  const description = escapeHtml(
    blog.meta_description ||
      blog.seo_description ||
      blog.description ||
      blog.excerpt ||
      blog.summary ||
      `Read ${title} on Farmlyt AI for agricultural technology and farming insights.`
  );

  const canonicalSlug = String(blog.slug || slug || '').trim();
  const canonical = `${SITE_URL}/blog/${encodeURIComponent(canonicalSlug)}`;

  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${title} | Farmlyt AI Blog</title>`
  );

  html = html.replace(
    '</head>',
    `    <meta name="description" content="${description}" />\n    <link rel="canonical" href="${canonical}" />\n  </head>`
  );

  return new Response(html, {
    status: originRes.status,
    headers: {
      ...Object.fromEntries(originRes.headers),
      'content-type': 'text/html; charset=utf-8',
    },
  });
}
