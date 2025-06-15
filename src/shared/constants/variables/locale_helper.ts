import { getLocale, setLocale } from "@/shared/localization/server";
import KTextConstants from "./text_constants";

export async function setPageLocaleAsync(params: Promise<{ locale: Language }>): Promise<Language> {
    const { locale } = await params;
    if (KTextConstants.localesSet.has(locale)) {
        return setPageLocale({ locale });
    } else {
        const cookieLocale = await getLocale();
        return setPageLocale({ locale: cookieLocale });
    }
}

export function setPageLocale(params: { locale: Language }): Language {
    const { locale } = params;
    try {
        setLocale(locale);
        return locale;
    } catch (e) {
        console.error(`Set Request Locale Error locale: ${locale}`, e);
        return locale;
    }
}