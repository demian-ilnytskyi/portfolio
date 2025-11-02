'use server'

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

export async function allowAnalytics(): Promise<boolean> {
    if (KTextConstants.isDevENV) return false;
    const countryCode = await cloudflareRepository.getCountryCode();

    return !!countryCode && !GDPR_APPLICABLE_COUNTRIES.has(countryCode);
}