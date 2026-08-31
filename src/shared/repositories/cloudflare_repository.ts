import type { env } from "cloudflare:workers";
import { getRequestExecutionContext } from "vinext/shims/request-context";
import { reportError } from "cloudflare-next-intl/errorHandling";
import { getCountry, getTimezone } from "cloudflare-next-intl/geo";
import onError from "../error_handling/on_error";

// Reports directly with just { onError } rather than importing the full
// intl_config (which binds generate.getCloudflareContext to THIS module) —
// avoids a circular import between cloudflare_repository and intl_config.
const errorHandlingConfig = { errorHandling: { onError: onError } };

interface Cf {
    country?: string;
    timezone?: string;
    [key: string]: unknown;
}

interface Context {
    env: typeof env;
    cf: Cf | undefined;
    ctx?: { waitUntil(promise: Promise<unknown>): void };
}

class CloudflareRepository {
    init() {
        // No cached context to reset
    }

    async getContext(options?: { async?: boolean; notSendError?: boolean; fresh?: boolean }): Promise<Context | null> {
        try {
            // Dynamic import: `cloudflare:workers` only resolves inside workerd —
            // a static top-level import would crash vinext's Node-based prerender.
            const { env } = await import("cloudflare:workers");
            return {
                env,
                cf: undefined,
                ctx: getRequestExecutionContext() ?? undefined,
            };
        } catch (error) {
            if (options?.notSendError === true) {
                console.warn(`CloudflareRepository getContext error: ${error}`);
            } else {
                void reportError(errorHandlingConfig, {
                    error,
                    classOrMethodName: 'CloudflareRepository getContext',
                });
            }
            return null;
        }
    }

    async getCountryCode(): Promise<string | undefined> {
        return await getCountry();
    }

    async getTimezone(): Promise<string | undefined> {
        return await getTimezone(undefined, 'UTC');
    }

    async hasAssetsBinding(): Promise<boolean> {
        const context = await this.getContext({ async: true, notSendError: true });
        return typeof context?.env.ASSETS?.fetch === 'function';
    }

    async fetch(
        input: RequestInfo | URL,
        init?: RequestInit
    ): Promise<Response | undefined> {
        const context = await this.getContext({ async: true });
        if (!context) return undefined;

        return await context.env.ASSETS?.fetch(input, init);
    }

    waitUntil({ callback, classOrMethodName, params, errorCallback, notSendError = false }: {
        callback: () => Promise<unknown | void>;
        classOrMethodName?: string;
        params?: Record<string, unknown>;
        errorCallback?: (error: unknown) => void;
        notSendError?: boolean;
    }): void {
        try {
            const ctx = getRequestExecutionContext();
            if (!ctx) return;

            ctx.waitUntil((async () => {
                try {
                    await callback();
                } catch (error) {
                    if (classOrMethodName) {
                        void reportError(errorHandlingConfig, {
                            error,
                            classOrMethodName,
                            params
                        });
                    }
                    if (errorCallback) {
                        errorCallback(error);
                    }
                }
            })());
        } catch (error) {
            if (!notSendError) {
                void reportError(errorHandlingConfig, {
                    error,
                    classOrMethodName: 'CloudflareRepository waitUntil',
                });
            } else {
                console.warn(`CloudflareRepository waitUntil error: ${error}`);
            }
            return;
        }
    }
}

const cloudflareRepository = new CloudflareRepository();

export default cloudflareRepository;
