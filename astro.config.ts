import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import { site } from "./content/site";
import { blogRedirects } from "./src/integrations/redirects";

const path = (relative: string) => fileURLToPath(new URL(relative, import.meta.url));

export default defineConfig({
  site: site.url,
  // Everything personal lives in content/; content/public holds the files served from the site root.
  publicDir: "content/public",
  // /blog, not /blog/: pages build to blog.html, matching the canonical URLs.
  trailingSlash: "never",
  build: { format: "file" },
  output: "static",
  adapter: cloudflare({
    // og.png is drawn with satori and the native resvg binding, which only run in Node.
    prerenderEnvironment: "node",
    imageService: "passthrough",
  }),
  // Nothing uses sessions; without this the adapter adds a KV binding to provision.
  session: false,
  integrations: [blogRedirects()],
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    // Keep og.png's native resvg binding out of dev pre-bundling, which cannot read a .node file.
    optimizeDeps: { exclude: ["@resvg/resvg-js"] },
    ssr: { optimizeDeps: { exclude: ["@resvg/resvg-js"] } },
    resolve: {
      alias: {
        $content: path("./content"),
        $lib: path("./src/lib"),
      },
    },
  },
});
