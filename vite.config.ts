import { defineConfig, type Plugin } from "vite";
import vinext from "vinext";
import { buildIdAsset } from "cloudflare-next-intl/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { kvDataAdapter } from "@vinext/cloudflare/cache/kv-data-adapter";
import { cdnAdapter } from "@vinext/cloudflare/cache/cdn-adapter";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import { fileURLToPath } from "node:url";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));
const intlConfigPath = fileURLToPath(new URL("./src/l18n/intl_config.ts", import.meta.url));
const messagesDir = fileURLToPath(new URL("./messages", import.meta.url));
const cfStubPath = fileURLToPath(new URL("./src/shared/helpers/cloudflare_workers_stub.ts", import.meta.url));
const cfniDir = fileURLToPath(new URL("./node_modules/cloudflare-next-intl/dist/src", import.meta.url)).replace(
  /\\/g,
  "/"
);

function cfWorkersClientStub(): Plugin {
  return {
    name: "cf-workers-client-stub",
    enforce: "pre",
    resolveId(id, _importer, options) {
      if (id === "cloudflare:workers" && (this.environment?.name === "client" || options?.ssr === false)) {
        return cfStubPath;
      }
    },
  };
}

function localeFilePlugin(): Plugin {
  return {
    name: "locale-file-plugin",
    enforce: "pre",
    resolveId(id, _importer, _options) {
      if (id.startsWith("@locale-file/")) {
        const file = id.replace("@locale-file/", "");
        return fileURLToPath(new URL(`./messages/${file}`, import.meta.url));
      }
      if (id === "@intl-config") {
        return intlConfigPath;
      }
      if (id === "cloudflare-next-intl" && this.environment?.name === "rsc") {
        return "\0cloudflare-next-intl:rsc";
      }
    },
    load(id) {
      if (id === "\0cloudflare-next-intl:rsc") {
        return `
export * from '${cfniDir}/config/index.js';
export * from '${cfniDir}/general/index.js';
export * from '${cfniDir}/server/index.js';
export * from '${cfniDir}/theme_switcher/index.js';
export * from '${cfniDir}/types/index.js';
export * from '${cfniDir}/client/index.js';
`;
      }
    },
    transform(code, id) {
      if (id.includes("cloudflare-next-intl") && code.includes("@locale-file")) {
        return {
          code: `
const __cfni_locales__ = import.meta.glob('/messages/*.json', { eager: true });
${code.replace(
            /\(await import\([`'"]@locale-file\/\$\{locale\}\.json[`'"]\)\)\.default/g,
            `(__cfni_locales__[\`/messages/\${locale}.json\`]?.default ?? (() => { throw new Error('missing locale'); })())`
          )}`,
          map: null,
        };
      }
    },
  };
}

export default defineConfig({
  plugins: [
    buildIdAsset(),
    cfWorkersClientStub(),
    localeFilePlugin(),
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
      { find: /^@locale-file\/(.*)$/, replacement: `${messagesDir}/$1` },
      { find: "@locale-file", replacement: messagesDir },
      { find: "@intl-config", replacement: intlConfigPath },
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
