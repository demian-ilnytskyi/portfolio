import { createHash } from "node:crypto";
import { Buffer } from "node:buffer";

const DEFAULT_BINDING = "NEXT_INC_CACHE_R2_BUCKET";
const PREFIX = "incremental-cache";

interface CacheItem {
    kind?: string;
    rscData?: ArrayBuffer | string;
    body?: ArrayBuffer | string;
    buffer?: ArrayBuffer | string;
    [key: string]: unknown;
}

interface StoredPayload {
    value: CacheItem | unknown;
    cacheControl?: unknown;
}

function serializeForJSON(value: unknown): unknown {
    if (!value || typeof value !== "object") return value;
    const item = value as CacheItem;
    if (item.kind === "APP_PAGE" && item.rscData instanceof ArrayBuffer) {
        return { ...item, rscData: Buffer.from(item.rscData).toString("base64") };
    }
    if (item.kind === "APP_ROUTE" && item.body instanceof ArrayBuffer) {
        return { ...item, body: Buffer.from(item.body).toString("base64") };
    }
    if (item.kind === "IMAGE" && item.buffer instanceof ArrayBuffer) {
        return { ...item, buffer: Buffer.from(item.buffer).toString("base64") };
    }
    return value;
}

function restoreArrayBuffers(value: unknown): unknown {
    if (!value || typeof value !== "object") return value;
    const item = value as CacheItem;
    if (item.kind === "APP_PAGE" && typeof item.rscData === "string") {
        const buf = Buffer.from(item.rscData, "base64");
        return { ...item, rscData: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) };
    }
    if (item.kind === "APP_ROUTE" && typeof item.body === "string") {
        const buf = Buffer.from(item.body, "base64");
        return { ...item, body: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) };
    }
    if (item.kind === "IMAGE" && typeof item.buffer === "string") {
        const buf = Buffer.from(item.buffer, "base64");
        return { ...item, buffer: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) };
    }
    return value;
}

export interface CacheHandlerContext {
    cacheControl?: unknown;
    revalidate?: number | false;
    tags?: string[];
    [key: string]: unknown;
}

export interface CacheEntryResult {
    lastModified: number;
    value: unknown;
    cacheControl?: unknown;
}

export class R2CacheHandler {
    constructor(
        private r2?: R2Bucket,
        private options?: { appPrefix?: string },
    ) {}

    private getR2Key(key: string): string {
        const buildId = process.env.__VINEXT_BUILD_ID || process.env.BUILD_ID || this.options?.appPrefix || "no-build-id";
        const hash = createHash("sha256").update(key).digest("hex");
        return `${PREFIX}/${buildId}/${hash}.cache`.replace(/\/+/g, "/");
    }

    async get(key: string, _ctx?: CacheHandlerContext): Promise<CacheEntryResult | null> {
        if (!this.r2) return null;
        try {
            const object = await this.r2.get(this.getR2Key(key));
            if (!object) return null;
            const raw = (await object.json()) as StoredPayload;
            const value = restoreArrayBuffers(raw.value);
            return {
                lastModified: object.uploaded.getTime(),
                value,
                cacheControl: raw.cacheControl,
            };
        } catch {
            return null;
        }
    }

    async set(key: string, data: unknown, ctx?: CacheHandlerContext): Promise<void> {
        if (!this.r2) return;
        try {
            const serializedValue = serializeForJSON(data);
            const payload: StoredPayload = {
                value: serializedValue,
                cacheControl: ctx?.cacheControl,
            };
            const tags = Array.isArray(ctx?.tags) ? ctx.tags.join(",") : undefined;
            await this.r2.put(this.getR2Key(key), JSON.stringify(payload), {
                customMetadata: tags ? { tags } : undefined,
            });
        } catch (error) {
            console.error(`[r2-cache] set failed: ${error}`);
        }
    }

    async revalidateTag(_tags: string | string[], _durations?: unknown): Promise<void> {
        // Tag revalidation
    }
}

export default function createR2CacheAdapter({
    env,
    options,
}: {
    env?: Record<string, unknown>;
    options?: { binding?: string; appPrefix?: string };
}): R2CacheHandler {
    const binding = options?.binding ?? DEFAULT_BINDING;
    const bucket = env?.[binding] as R2Bucket | undefined;
    return new R2CacheHandler(bucket, options);
}
