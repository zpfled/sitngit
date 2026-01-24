import { promises as fs } from "node:fs";
import path from "node:path";
import config from "../astro.config.mjs";
import site from "../src/content/site.json" assert { type: "json" };

const siteUrl = config.site ?? "https://sitandgit.com";
const outputPath = path.join(process.cwd(), "public", "sitemap.xml");

const paths = new Set([
  "/",
  "/about",
  "/contact",
  "/faq",
  "/get-a-quote",
  "/service-area",
  "/services",
  "/thank-you"
]);

site.services?.forEach((service) => {
  if (service?.slug) paths.add(`/services/${service.slug}`);
});

Object.keys(site.service_area_pages ?? {}).forEach((slug) => {
  paths.add(`/service-area/${slug}`);
});

const urls = Array.from(paths)
  .filter(Boolean)
  .sort()
  .map((pathname) => new URL(pathname, siteUrl).toString());

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((loc) => `  <url><loc>${loc}</loc></url>`).join("\n") +
  `\n</urlset>\n`;

await fs.writeFile(outputPath, xml);
console.log(`Generated sitemap with ${urls.length} URLs.`);
