import { promises as fs } from "node:fs";
import path from "node:path";
import config from "../astro.config.mjs";
import { readFile } from "node:fs/promises";

const siteUrl = config.site ?? "https://sitandgit.com";
const site = JSON.parse(
  await readFile(new URL("../src/content/site.json", import.meta.url), "utf-8")
);
const outputPath = path.join(process.cwd(), "public", "sitemap.xml");

const paths = new Set([
  "/",
  "/about",
  "/contact",
  "/faq",
  "/get-a-quote",
  "/service-area",
  "/services"
]);

site.services?.forEach((service) => {
  if (service?.slug) paths.add(`/services/${service.slug}`);
});

const townSlugs = new Set(
  (site.service_area?.counties ?? []).flatMap((county) =>
    (county.towns ?? []).map((town) => town.slug)
  )
);
const indexableTownSlugs = new Set(["viroqua-wi", "richland-center-wi"]);

Object.keys(site.service_area_pages ?? {}).forEach((slug) => {
  if (!townSlugs.has(slug) || indexableTownSlugs.has(slug)) {
    paths.add(`/service-area/${slug}`);
  }
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
