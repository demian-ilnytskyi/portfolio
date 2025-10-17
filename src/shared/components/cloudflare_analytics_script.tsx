import Script from "next/script";
import KTextConstants from "../constants/variables/text_constants";
import cloudflareRepository from "../repositories/cloudflare_repository";

const GDPR_APPLICABLE_COUNTRIES = new Set([
    'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR',
    'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL',
    'PT', 'RO', 'SE', 'SI', 'SK',
    'IS', 'LI', 'NO',
    'GB',
    'CH',
]);

export default async function CloudflareAnalyticsScript(): Promise<Component | null> {
    if (KTextConstants.isDevENV) return null;
    const countryCode = await cloudflareRepository.getCountryCode();

    if (countryCode && !GDPR_APPLICABLE_COUNTRIES.has(countryCode)) {
        return <Script
            defer
            src='https://static.cloudflareinsights.com/beacon.min.js'
            data-cf-beacon='{"token": "e1c02e761c374b7dbc4c4bf72061abcf"}'
            strategy="afterInteractive" />;
    } else {
        return null;
    }
}