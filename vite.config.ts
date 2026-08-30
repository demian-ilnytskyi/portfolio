import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflareNextIntl } from "cloudflare-next-intl/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { kvDataAdapter } from "@vinext/cloudflare/cache/kv-data-adapter";
import { cdnAdapter } from "@vinext/cloudflare/cache/cdn-adapter";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import { fileURLToPath } from "node:url";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  plugins: [
    cloudflareNextIntl(),
    vinext({
      cache: { data: kvDataAdapter(), cdn: cdnAdapter() },
      images: { optimizer: imagesOptimizer() },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
  resolve: {
    dedupe: [
      "react",
      "react-dom",
    ],
    alias: [
      { find: "@", replacement: srcDir },
    ],
  },
  ssr: {
    noExternal: ["cloudflare-next-intl"],
  },
  optimizeDeps: {
    // Force these into the INITIAL scan so Vite prebundles them once, up
    // front, instead of meeting them for the first time at request time.
    // `vinext` itself is excluded below (unbundled) and imports `react`
    // internally (its `AwaitAppRenderDependencies` shim calls `React.use()`
    // on a render-dependency promise) — if `react`/`react-dom` are only met
    // lazily at request time, a later mid-session re-optimize can swap in a
    // new generation whose `use` export vinext's already-loaded reference
    // doesn't see, throwing "Cannot read properties of null (reading 'use')"
    // and surfacing to the client as a failed Suspense boundary.
    // drizzle-orm/pg/jose are reachable only through server-only repository
    // modules via `cloudflare-next-intl/db`, so the initial scan misses them
    // the same way.
    include: [
      "react",
      "react-dom",
      "drizzle-orm",
      "drizzle-orm/node-postgres",
      "drizzle-orm/pg-proxy",
      "drizzle-orm/pg-core",
      "pg",
      "jose",
    ],
    exclude: [
      "cloudflare-next-intl",
      "vinext",
    ],
  },
});
