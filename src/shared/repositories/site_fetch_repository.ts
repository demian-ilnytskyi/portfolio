import KTextConstants from "../constants/variables/text_constants";
import { reportError } from "cloudflare-next-intl/errorHandling";
import cloudflareRepository from "./cloudflare_repository";

interface FetchRepositoryInterface {
    path: string;
    header?: HeadersInit;
}
export class SiteFetchRepository {
    // Function to fetch more Fetch for infinite scroll
    // async fetchFetch({ }: FetchRepositoryInterface): Promise<void> {
    // };
    // Constants

    // Utility function to get base URL
    // async getBaseUrl(): Promise<string> {
    //     try {
    //         const headersList = await headers();
    //         const host = headersList.get("host");
    //         if (!host) throw new Error("Host header not found");
    //         return IS_DEV ? `http://${host}` : `https://${host}`; // Use HTTPS in production
    //     } catch (error) {
    //         throw new Error(`Failed to determine base URL: ${error instanceof Error ? error.message : String(error)}`);
    //     }
    // }

    // Main fetch function
    async fetchTextData({ path, header }: FetchRepositoryInterface): Promise<string | null> {
        try {
            // const baseUrl = await this.getBaseUrl();
            const fetchUrl = new URL(path, KTextConstants.baseUrl).toString();

            const hasCloudflare = await cloudflareRepository.hasAssetsBinding();

            const response = hasCloudflare
                ? await cloudflareRepository.fetch(fetchUrl, {
                    cf: { cacheTtl: 86400 }, // Cache for 1 day
                    headers: header,
                })
                : await fetch(fetchUrl, {
                    cache: "no-store",
                    headers: header,
                });

            if (!response) {
                throw new Error('fetch unknown error');
            }

            if (!response.ok) {
                throw new Error(await response.text() || `HTTP ${response.status}`);
            }

            return await response.text();
        } catch (e) {
            void reportError(undefined, {
                error: e,
                classOrMethodName: 'SiteFetchRepository fetchTextData',
                params: { path, header }
            });
            return null;
        }
    }
}

const siteFetchRepository = new SiteFetchRepository();

export default siteFetchRepository;
