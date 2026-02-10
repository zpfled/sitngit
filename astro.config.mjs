import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://sitandgit.com",
  integrations: [tailwind()],
  output: "static",
  trailingSlash: "always"
});
