import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const canonicalBase = "https://sitandgit.com";
const distRoot = "dist";

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

const extract = (html, pattern) => {
  const match = html.match(pattern);
  return match ? match[1] : null;
};

const expectedForFile = (filePath) => {
  const rel = relative(distRoot, filePath).replace(/\\/g, "/");
  if (rel === "index.html") return `${canonicalBase}/`;
  if (!rel.endsWith("/index.html")) return null;
  const pathPart = rel.replace(/\/index\.html$/, "");
  return `${canonicalBase}/${pathPart}/`;
};

const main = async () => {
  const allFiles = await walk(distRoot);
  const files = allFiles.filter((file) => {
    const rel = relative(distRoot, file).replace(/\\/g, "/");
    return rel === "index.html" || rel.startsWith("services/");
  });

  let failures = 0;

  for (const file of files) {
    const html = await readFile(file, "utf8");
    const canonical = extract(html, /<link rel="canonical" href="([^"]+)"/);
    const ogUrl = extract(html, /<meta property="og:url" content="([^"]+)"/);
    const expected = expectedForFile(file);

    const issues = [];
    if (!canonical) issues.push("missing canonical");
    if (!ogUrl) issues.push("missing og:url");
    if (canonical && expected && canonical !== expected) {
      issues.push(`canonical mismatch (expected ${expected})`);
    }
    if (ogUrl && expected && ogUrl !== expected) {
      issues.push(`og:url mismatch (expected ${expected})`);
    }
    if (canonical && ogUrl && canonical !== ogUrl) {
      issues.push("canonical != og:url");
    }

    if (issues.length) {
      failures += 1;
      console.error(`${file}: ${issues.join("; ")}`);
    }
  }

  if (failures) {
    console.error(`Canonical verification failed (${failures} file(s)).`);
    process.exit(1);
  }

  console.log(`Canonical verification passed (${files.length} file(s)).`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
