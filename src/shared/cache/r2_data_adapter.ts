import { fileURLToPath } from "node:url";

export interface R2DataAdapterOptions {
    binding?: string;
    appPrefix?: string;
    [key: string]: unknown;
}

export interface R2DataAdapterDescriptor {
    adapter: string;
    options: R2DataAdapterOptions | undefined;
    capabilities: {
        buildIdentity: "response-header";
        warmup: "data-cache";
    };
    [key: string]: unknown;
}

export function r2DataAdapter(options?: R2DataAdapterOptions): R2DataAdapterDescriptor {
    return {
        adapter: fileURLToPath(new URL("./r2_data_adapter.runtime.ts", import.meta.url)),
        options,
        capabilities: {
            buildIdentity: "response-header" as const,
            warmup: "data-cache" as const,
        },
    };
}
