import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const canonicalBase = "https://sitandgit.com";
const localBusinessId = `${canonicalBase}/#localbusiness`;
const websiteId = `${canonicalBase}/#website`;
const distRoot = "dist";

const serviceSlugs = new Set([
  "portable-restrooms",
  "ada-restrooms",
  "handwashing-stations",
  "toilet-servicing"
]);

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
    } else if (entry.isFile() && entry.name === "index.html") {
      files.push(fullPath);
    }
  }
  return files;
};

const extractJsonLd = (html) => {
  const scripts = [];
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  return scripts.flatMap((raw) => {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  });
};

const isServicePage = (relPath) => {
  const match = relPath.match(/^services\/([^/]+)\/index\.html$/);
  return match ? serviceSlugs.has(match[1]) : false;
};

const main = async () => {
  const files = await walk(distRoot);
  let failures = 0;

  for (const file of files) {
    const rel = relative(distRoot, file).replace(/\\/g, "/");
    const html = await readFile(file, "utf8");
    const jsonLd = extractJsonLd(html);

    const localBusinesses = jsonLd.filter((item) => item["@type"] === "LocalBusiness");
    const websites = jsonLd.filter((item) => item["@type"] === "WebSite");
    const services = jsonLd.filter((item) => item["@type"] === "Service");

    const issues = [];
    const lbMatch = localBusinesses.filter((item) => item["@id"] === localBusinessId);
    const wsMatch = websites.filter((item) => item["@id"] === websiteId);

    if (lbMatch.length !== 1) issues.push(`LocalBusiness count=${lbMatch.length}`);
    if (wsMatch.length !== 1) issues.push(`WebSite count=${wsMatch.length}`);

    if (isServicePage(rel)) {
      if (services.length !== 1) {
        issues.push(`Service count=${services.length}`);
      } else {
        const provider = services[0].provider;
        if (!provider || provider["@id"] !== localBusinessId) {
          issues.push("Service provider missing or not LocalBusiness @id");
        }
      }
    } else if (services.length > 0) {
      issues.push(`Unexpected Service schema count=${services.length}`);
    }

    if (issues.length) {
      failures += 1;
      console.error(`${file}: ${issues.join("; ")}`);
    }
  }

  if (failures) {
    console.error(`JSON-LD verification failed (${failures} file(s)).`);
    process.exit(1);
  }

  console.log("JSON-LD verification passed.");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
