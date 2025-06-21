import { getCloudflareContext } from "@opennextjs/cloudflare";
import KTextConstants from "../constants/variables/text_constants";


const IS_DEV = process.env.NODE_ENV === "development";
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

            if (IS_DEV) {
                const response = await fetch(fetchUrl, {
                    cache: "no-store",
                    headers: header,
                });

                if (!response.ok) {
                    throw new Error(await response.text() || `HTTP ${response.status}`);
                }

                return await response.text();
            } else {

                // Production: Cloudflare ASSETS
                const { env } = getCloudflareContext();
                const response = await env.ASSETS?.fetch(fetchUrl, {
                    // Add cache control if needed
                    cf: { cacheTtl: 3600 }, // Cache for 1 hour if supported
                    headers: header,
                });

                if (!response) {
                    throw new Error('fetch unknown error');
                }

                if (!response.ok) {
                    throw new Error(await response.text() || `HTTP ${response.status}`);
                }

                return await response.text();
            }
        } catch (e) {
            console.error(`Fetch link error path: ${path}, header: ${header} `, e)
            return null;
        }
    }
}

const siteFetchRepository = new SiteFetchRepository();

export default siteFetchRepository;
