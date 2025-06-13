import KTextConstants from '@/shared/constants/variables/text_constants';
import { defineRouting } from 'next-intl/routing';

export const localeCookieName = '__user_locale_key__';

export const routing = defineRouting({
    localePrefix: 'as-needed',

    // A list of all locales that are supported
    locales: KTextConstants.locales,

    // Used when no locale matches
    defaultLocale: KTextConstants.defaultLocale,

    localeCookie: {
        name: localeCookieName,
        maxAge: 2592000, // 30 days
    },
});
