import Script from "next/script";
import KTextConstants from "../constants/variables/text_constants";
import cloudflareRepository from "../repositories/cloudflare_repository";

export default async function CloudflareAnalyticsScript(): Promise<Component | null> {
    if (KTextConstants.isDevENV) return null;

    if (await cloudflareRepository.isEUCountry()) {
        return <Script
            defer
            src='https://static.cloudflareinsights.com/beacon.min.js'
            data-cf-beacon='{"token": "e1c02e761c374b7dbc4c4bf72061abcf"}'
            strategy="afterInteractive" />;
    } else {
        return null;
    }
}