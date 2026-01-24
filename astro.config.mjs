import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://www.sitandgit.com",
  integrations: [tailwind()],
  output: "static",
  trailingSlash: "never"
});
