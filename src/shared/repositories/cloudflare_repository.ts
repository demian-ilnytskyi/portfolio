import type { CloudflareContext } from "@opennextjs/cloudflare";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import errorRepository from "./error_repository";

type Context = CloudflareContext<CfProperties, ExecutionContext>;

class CloudflareRepository {
    private context: Context | null = null;

    constructor() {
        this.context = null;
    }

    init() {
        this.context = null;
    }

    async getContext(options: {
        async: true;
        notSendError?: boolean;
        fresh?: boolean;
    }): Promise<Context | null>;
    getContext(options?: {
        async: false;
        notSendError?: boolean;
        fresh?: boolean;
    }): Context | null;

    getContext(options?: {
        async: boolean;
        notSendError?: boolean;
        fresh?: boolean;
    }): Context | null | Promise<Context | null> {
        try {
            if (options?.fresh === true) {
                if (options.async === true) {
                    return (async () => {
                        try {
                            return await getCloudflareContext({ async: true });
                        } catch (error) {
                            if (options.notSendError === true) {
                                console.warn(`CloudflareRepository getContext error(async, fresh): ${error}`);
                            } else {
                                errorRepository.sendErrorReport({
                                    error,
                                    classOrMethodName: 'CloudflareRepository getContext(async, fresh)',
                                });
                            }
                            return null;
                        }
                    })();
                }
                return getCloudflareContext();
            }

            if (!this.context) {
                if (options?.async === true) {
                    return (async () => {
                        try {
                            this.context = await getCloudflareContext({ async: true });
                            return this.context;
                        } catch (error) {
                            if (options.notSendError === true) {
                                console.warn(`CloudflareRepository getContext error(async): ${error}`);
                            } else {
                                errorRepository.sendErrorReport({
                                    error,
                                    classOrMethodName: 'CloudflareRepository getContext(async)',
                                });
                            }
                            return this.context;
                        }
                    })();
                } else {
                    this.context = getCloudflareContext();
                }
            }
        } catch (error) {
            if (options?.notSendError === true) {
                console.warn(`CloudflareRepository getContext error: ${error}`);
            } else {
                errorRepository.sendErrorReport({
                    error,
                    classOrMethodName: 'CloudflareRepository getContext',
                });
            }
        }
        return this.context;
    }

    async getCountryCode(): Promise<string | undefined> {
        try {
            const context = await this.getContext({ async: true });
            if (!context) return undefined;
            if (typeof context.cf?.country === 'string') {
                return context.cf.country;
            } else {
                return undefined;
            }
        } catch (error) {
            errorRepository.sendErrorReport({
                error,
                classOrMethodName: 'CloudflareRepository isEUCountry',
            });
        }
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
            const context = this.getContext();
            if (!context) return;

            context.ctx.waitUntil((async () => {
                try {
                    await callback();
                } catch (error) {
                    if (classOrMethodName) {
                        errorRepository.sendErrorReport({
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
                errorRepository.sendErrorReport({
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

// Export a singleton instance of the CacheRepository
const cloudflareRepository = new CloudflareRepository();

export default cloudflareRepository;
