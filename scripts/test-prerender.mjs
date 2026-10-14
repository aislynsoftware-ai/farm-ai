
import puppeteer from "puppeteer";

const browser = await puppeteer.launch({ headless: true });

try {
  const page = await browser.newPage();

  const url =
    "http://127.0.0.1:4173/blog/best-machine-learning-crop-health-monitor-in-bangalore";

  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  await new Promise((resolve) => setTimeout(resolve, 5000));

  const result = await page.evaluate(() => ({
    title: document.title,

    descriptions: Array.from(
      document.querySelectorAll('meta[name="description"]')
    ).map((element) => element.content),

    canonical: document.querySelector('link[rel="canonical"]')?.href,
  }));

  console.log("TITLE:", result.title);
  console.log(
    "ALL DESCRIPTIONS:",
    JSON.stringify(result.descriptions, null, 2)
  );
  console.log("CANONICAL:", result.canonical);
} catch (error) {
  console.error("TEST FAILED:", error.message);
} finally {
  await browser.close();
}
