import { getRequestConfig } from 'next-intl/server';
import { localeCookieName } from './routing';
import { cookies } from 'next/headers';
import KTextConstants from '@/shared/constants/variables/text_constants';

export default getRequestConfig(async () => {
    let locale: Language = KTextConstants.defaultLocale;
    // Typically corresponds to the `[locale]` segment
    try {
        const requested = await cookies();
        locale = (requested.get(localeCookieName)?.value as Language | undefined) ?? KTextConstants.defaultLocale;
    } catch (e) {
        console.error('Request Config Get Locale Error ', e);
    }

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});