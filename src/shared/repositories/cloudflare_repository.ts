import { getCloudflareContext } from "@opennextjs/cloudflare";
import errorRepository from "./error_repository";
class CloudflareRepository {
    async fetch(
        input: RequestInfo | URL,
        init?: RequestInit
    ): Promise<Response | undefined> {
        const context = getCloudflareContext();

        return await context.env.ASSETS?.fetch(input, init);
    }

    waitUntil({ callback, classOrMethodName, params, errorCallback }: {
        callback: () => Promise<unknown | void>;
        classOrMethodName?: string;
        params?: Record<string, unknown>;
        errorCallback?: (error: unknown) => void;
    }): void {
        try {
            const context = getCloudflareContext();

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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            // Return null in case of an error during retrieval
            return;
        }
    }
}

// Export a singleton instance of the CacheRepository
const cloudflareRepository = new CloudflareRepository();

export default cloudflareRepository;
