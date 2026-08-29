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
    exclude: [
      "cloudflare-next-intl",
      "vinext",
    ],
  },
});

