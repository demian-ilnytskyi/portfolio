import { routing } from "@/l18n/routing";
import { setRequestLocale } from "next-intl/server";

export function generateStaticParams(): { locale: Language }[] {
    return routing.locales.map((locale) => ({ locale }));
}

export async function setPageLocaleAsync(params: Promise<{ locale: Language }>): Promise<Language> {
    const { locale } = await params;
    return setPageLocale({ locale });
}

export function setPageLocale(params: { locale: Language }): Language {
    const { locale } = params;
    try {
        setRequestLocale(locale);
        return locale;
    } catch (e) {
        console.error(`Set Request Locale Error locale: ${locale}`, e);
        return locale;
    }
}