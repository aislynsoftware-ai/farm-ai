const API_URL = 'https://aislyn.in/admin/admin/farmly_api.php';
const SITE_URL = 'https://www.farmlytai.in';

export const config = {
  matcher: '/blog/:slug',
  runtime: 'nodejs',
};

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fetchWithTimeout(input, init, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const slug = decodeURIComponent(url.pathname.replace('/blog/', ''));

  if (!slug) {
    return;
  }

  let blog = null;

  try {
    const apiRes = await fetchWithTimeout(
      `${API_URL}?slug=${encodeURIComponent(slug)}`,
      undefined,
      3000
    );
    const data = await apiRes.json();
    blog = data?.blog || (Array.isArray(data) ? data[0] : null) || null;
  } catch {
    return;
  }

  if (!blog) {
    return;
  }

  let originRes;
  let html;
  try {
    originRes = await fetchWithTimeout(request, undefined, 5000);

    // 304/204/205/101/103 are "null body status" responses — the Response
    // constructor throws if given a body alongside one of these, so just
    // pass the origin response through untouched.
    if ([101, 103, 204, 205, 304].includes(originRes.status)) {
      return originRes;
    }

    html = await originRes.text();
  } catch {
    return;
  }

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

  const headers = new Headers(originRes.headers);
  headers.delete('content-encoding');
  headers.delete('content-length');
  headers.set('content-type', 'text/html; charset=utf-8');

  return new Response(html, {
    status: originRes.status,
    headers,
  });
}
