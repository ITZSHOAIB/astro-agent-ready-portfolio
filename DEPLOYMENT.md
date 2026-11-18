# Deployment

The site deploys to Cloudflare Workers: the pages are static files, and one Worker serves them plus the `/mcp` endpoint. You need a Cloudflare account and the repo on GitHub.

First, pick a name for the Worker and set it as `name` in `wrangler.jsonc`. It becomes the `*.workers.dev` address until your own domain is connected.

## Connect GitHub (recommended)

In the Cloudflare dashboard: Workers & Pages, Create, Import a repository. Pick the repo, then use:

- Project name: the same `name` as in `wrangler.jsonc`
- Production branch: `main`
- Build command: `pnpm verify`
- Deploy command: `pnpm run deploy`
- Root directory: `/`

Environment variables (build):

- `NODE_VERSION=24`
- `PNPM_VERSION=11.9.0`

Compatibility flags live in `wrangler.jsonc`, so there is nothing to set in the dashboard.

`pnpm verify` runs the checks and the build, so a broken site never publishes. A fresh clone still passes with the starter content; `pnpm check-content` (without flags) is what tells you when you have replaced everything.

## Direct upload

No Git integration needed:

```sh
pnpm install
pnpm verify
pnpm exec wrangler login
pnpm run deploy
```

`pnpm run deploy` runs `wrangler deploy`, which uploads the build in `dist/`.

## Custom domain

In the Worker: Settings, Domains & Routes, Add, Custom domain. Use the same address as `site.url` in `content/site.ts`, because canonical links, feeds and the sitemap are built from it.

## Analytics (optional)

Create a Web Analytics site in Cloudflare and paste its beacon token into `analyticsToken` in `content/site.ts`. It is cookie-free. Leave it empty to turn analytics off.

## Another host?

Everything except `/mcp` is prerendered to static files. `features.mcp` needs a host that runs server code, which the Worker is. To host elsewhere, set `features.mcp` to `false`, delete `src/pages/mcp.ts`, and swap `@astrojs/cloudflare` in `astro.config.ts` for your host's Astro adapter (or remove it for a plain static site in `dist/`).
