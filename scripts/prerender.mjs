
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

const DIST = path.join(ROOT, 'dist');
const SITEMAP = path.join(DIST, 'sitemap.xml');

const SITE_URL = 'https://www.farmlytai.in';
const LOCAL_URL = 'http://127.0.0.1:4173';
const PORT = '4173';
const TIMEOUT = 60000;

const CONCURRENCY = Math.max(
  1,
  Math.min(
    6,
    Number.parseInt(process.env.PRERENDER_CONCURRENCY || '4', 10) || 4
  )
);

const GENERIC_TITLE =
  'Farmlyt AI | Smart Agriculture and AI Insights';

const GENERIC_DESCRIPTION =
  'Explore Farmlyt AI for smart agriculture, agricultural technology, AI-powered farming insights and data-driven solutions.';

async function waitForServer(server) {
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) {
      throw new Error('Vite preview stopped before starting.');
    }

    try {
      const response = await fetch(LOCAL_URL);
      if (response.ok) return;
    } catch {
      // Wait until Vite preview is ready.
    }

    await delay(1000);
  }

  throw new Error('Vite preview did not start within 60 seconds.');
}

async function getBlogUrls() {
  await fs.access(SITEMAP);

  const xml = await fs.readFile(SITEMAP, 'utf8');

  const urls = [...xml.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)]
    .map((match) => match[1].replaceAll('&amp;', '&').trim())
    .filter((url) => {
      try {
        const parsed = new URL(url);

        return (
          parsed.origin === SITE_URL &&
          /^\/blog\/[^/]+\/?$/i.test(parsed.pathname)
        );
      } catch {
        return false;
      }
    });

  return [...new Set(urls)];
}

async function getPageDiagnostics(page) {
  return page.evaluate(() => ({
    title: document.title.trim() || 'MISSING',

    description:
      document.querySelector('meta[name="description"]')
        ?.content.trim() || 'MISSING',

    descriptionTagCount: document.querySelectorAll(
      'meta[name="description"]'
    ).length,

    canonical:
      document.querySelector('link[rel="canonical"]')?.href ||
      'MISSING',

    robots:
      document.querySelector('meta[name="robots"]')?.content ||
      'MISSING',

    bodyLength: document.body?.innerText?.trim().length || 0,

    bodyPreview:
      document.body?.innerText?.trim().slice(0, 500) || ''
  }));
}

async function validateBlogPage(page, route) {
  const expectedPath =
    route.pathname.replace(/\/$/, '') || '/';

  try {
    await page.waitForFunction(
      ({ expectedPath, genericTitle }) => {
        const title = document.title.trim();

        const description = document
          .querySelector('meta[name="description"]')
          ?.content.trim();

        const canonical = document.querySelector(
          'link[rel="canonical"]'
        )?.href;

        const bodyText =
          document.body?.innerText?.trim() || '';

        if (!canonical || !description || !title) {
          return false;
        }

        let canonicalUrl;

        try {
          canonicalUrl = new URL(canonical);
        } catch {
          return false;
        }

        const canonicalPath =
          canonicalUrl.pathname.replace(/\/$/, '') || '/';

        const hasArticle =
          bodyText.length > 100 &&
          !/^\s*Loading\.{0,3}\s*$/i.test(bodyText);

        const hasBlogTitle =
          title !== genericTitle &&
          !title.startsWith('Loading');

        return Boolean(
          canonicalUrl.origin ===
            'https://www.farmlytai.in' &&
          canonicalPath === expectedPath &&
          hasBlogTitle &&
          hasArticle
        );
      },
      {
        timeout: TIMEOUT
      },
      {
        expectedPath,
        genericTitle: GENERIC_TITLE
      }
    );
  } catch (error) {
    const diagnostics = await getPageDiagnostics(page);

    console.error(
      '[prerender] Page state at timeout:',
      JSON.stringify(diagnostics, null, 2)
    );

    throw new Error(
      `Blog page did not finish rendering: ${error.message}`
    );
  }

  const meta = await getPageDiagnostics(page);

  const expectedCanonical =
    `${SITE_URL}${expectedPath}`;

  if (meta.canonical !== expectedCanonical) {
    throw new Error(
      `Canonical mismatch. Expected "${expectedCanonical}", received "${meta.canonical}".`
    );
  }

  if (!meta.title || meta.title === GENERIC_TITLE) {
    throw new Error('Missing or generic blog title.');
  }

  if (
    !meta.description ||
    meta.description === GENERIC_DESCRIPTION ||
    meta.description.toLowerCase().startsWith(
      'explore farmlyt ai for smart agriculture'
    )
  ) {
    throw new Error(
      'Missing or generic blog meta description.'
    );
  }

  if (meta.descriptionTagCount !== 1) {
    throw new Error(
      `Expected one meta description tag, found ${meta.descriptionTagCount}.`
    );
  }

  if (meta.bodyLength <= 100) {
    throw new Error(
      'Blog content is missing or too short.'
    );
  }

  if (
    /blog not found|article not found|404 not found/i.test(
      meta.bodyPreview
    )
  ) {
    throw new Error(
      'The page appears to display a not-found message.'
    );
  }

  return meta;
}

async function configurePage(page, slug) {
  page.setDefaultNavigationTimeout(TIMEOUT);
  page.setDefaultTimeout(TIMEOUT);

  // Keep JavaScript, CSS and API requests enabled.
  // Block images, media and fonts to reduce prerender overhead.
  await page.setRequestInterception(true);

  page.on('request', (request) => {
    const type = request.resourceType();

    if (['image', 'media', 'font'].includes(type)) {
      request.abort().catch(() => {});
    } else {
      request.continue().catch(() => {});
    }
  });

  page.on('pageerror', (error) => {
    console.error(
      `[prerender] Browser error (${slug}): ${error.message}`
    );
  });
}

async function prerenderBlog(browser, publicUrl) {
  const route = new URL(publicUrl);

  let segments;

  try {
    segments = decodeURIComponent(route.pathname)
      .split('/')
      .filter(Boolean);
  } catch {
    throw new Error('The URL contains invalid encoding.');
  }

  if (
    segments.length !== 2 ||
    segments[0].toLowerCase() !== 'blog' ||
    segments.some(
      (part) =>
        part === '.' ||
        part === '..' ||
        part.includes('/') ||
        part.includes('\\')
    )
  ) {
    throw new Error('Unexpected blog URL path.');
  }

  const slug = segments[1];
  const page = await browser.newPage();

  try {
    await configurePage(page, slug);

    const localUrl =
      `${LOCAL_URL}${route.pathname}${route.search}`;

    const response = await page.goto(localUrl, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT
    });

    if (!response || !response.ok()) {
      throw new Error(
        `Page returned HTTP ${response?.status() ?? 'unknown'}.`
      );
    }

    const meta = await validateBlogPage(page, route);

    const outputDir = path.join(
      DIST,
      'blog',
      slug
    );

    const outputFile = path.join(
      outputDir,
      'index.html'
    );

    const html = await page.content();

    await fs.mkdir(outputDir, {
      recursive: true
    });

    await fs.writeFile(
      outputFile,
      html,
      'utf8'
    );

    console.log(
      `[prerender] SUCCESS: ${publicUrl}`
    );

    console.log(
      `[prerender] Title: ${meta.title}`
    );

    console.log(
      `[prerender] Description: ${meta.description}`
    );

    console.log(
      `[prerender] Canonical: ${meta.canonical}`
    );

    console.log(
      `[prerender] Saved: ${outputFile}`
    );

    return { url: publicUrl, success: true };
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('[prerender] Starting...');

  console.log(
    `[prerender] Concurrency: ${CONCURRENCY}`
  );

  const blogUrls = await getBlogUrls();

  if (!blogUrls.length) {
    throw new Error(
      'No blog URLs found in dist/sitemap.xml.'
    );
  }

  console.log(
    `[prerender] Found ${blogUrls.length} blog URLs.`
  );

  const isWindows = process.platform === 'win32';

  const server = spawn(
    isWindows ? 'npm.cmd' : 'npm',
    [
      'run',
      'preview',
      '--',
      '--host',
      '127.0.0.1',
      '--port',
      PORT,
      '--strictPort'
    ],
    {
      cwd: ROOT,
      stdio: 'inherit',
      shell: isWindows
    }
  );

  let browser;
  let succeeded = 0;
  let failed = 0;
  let nextIndex = 0;

  try {
    await waitForServer(server);

    browser = await puppeteer.launch({
      headless: true
    });

    async function worker() {
      while (true) {
        const index = nextIndex++;
        if (index >= blogUrls.length) return;

        const publicUrl = blogUrls[index];

        console.log(
          `[prerender] Processing ${index + 1}/${blogUrls.length}: ${publicUrl}`
        );

        try {
          await prerenderBlog(
            browser,
            publicUrl
          );

          succeeded++;
        } catch (error) {
          failed++;

          console.error(
            `[prerender] FAILED: ${publicUrl}`
          );

          console.error(
            `[prerender] Reason: ${error.message}`
          );
        }
      }
    }

    await Promise.all(
      Array.from(
        {
          length: Math.min(
            CONCURRENCY,
            blogUrls.length
          )
        },
        () => worker()
      )
    );

    console.log('');
    console.log('========== PRERENDER SUMMARY ==========');
    console.log(`Total blog URLs: ${blogUrls.length}`);
    console.log(`Succeeded: ${succeeded}`);
    console.log(`Failed: ${failed}`);
    console.log('=======================================');

    if (failed > 0) {
      throw new Error(
        `${failed} blog page(s) failed. Review the diagnostics above.`
      );
    }

    console.log(
      '[prerender] All blog pages generated successfully.'
    );
  } finally {
    if (browser) {
      await browser.close();
    }

    if (server.exitCode === null) {
      server.kill();
    }
  }
}

main().catch((error) => {
  console.error(
    '[prerender] ERROR:',
    error.message
  );

  process.exitCode = 1;
});
