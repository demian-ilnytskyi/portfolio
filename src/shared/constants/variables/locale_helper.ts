import { setLocale } from "@/shared/localization/server";

export async function setPageLocaleAsync(params: Promise<{ locale: Language }>): Promise<Language> {
    const { locale } = await params;
    return setPageLocale({ locale });
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