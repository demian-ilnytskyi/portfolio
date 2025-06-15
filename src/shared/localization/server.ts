import CookieKey from "../constants/variables/cookie_key";
import KTextConstants from "../constants/variables/text_constants";

export type Language = "en" | "uk";

export type TranslationEntry = string | TranslationObject;
export interface TranslationObject {
    [key: string]: TranslationEntry;
}

export type TranslatorReturnType = (key: string) => string;

// Caches for loaded translation objects and memoized translation functions.
const loadedTranslations = new Map<Language, TranslationObject>();
const translationFunctionsCache = new Map<string, TranslatorReturnType>();
let currentLanguage: Language | undefined = undefined; // Renamed 'language' to 'currentLanguage' for clarity

/**
 * Sets the current locale.
 * @param locale The language to set.
 */
export function setLocale(locale: Language): void {
    currentLanguage = locale;
}
export function getLagnuageCustom(): Language {
    return currentLanguage ?? KTextConstants.defaultLocale;
}

export function getLocaleClient(): Language {
    if (currentLanguage) {
        return currentLanguage;
    } else {
        throw Error('you can use useLocale only with LocationzationProvider')
    }
}

export function getMessagesClient(): TranslationObject {
    const value = currentLanguage ? loadedTranslations.get(currentLanguage) : undefined;
    if (value) {
        return value;
    } else {
        throw Error('you can use useTranslations only with LocationzationProvider')
    }
}

/**
 * Logs a warning message and returns a fallback translation function.
 * This function helps in debugging missing translations or incorrect structures.
 * @param message The main warning message.
 * @param cacheKey The key used for caching the translation function.
 * @param locale The effective locale.
 * @param namespace The namespace being accessed.
 * @param key The specific translation key being looked up.
 * @returns A fallback function that returns the key itself.
 */
const warnAndReturnFallback = (
    message: string,
    cacheKey: string,
    locale: Language,
    namespace?: string,
    key?: string,
): TranslatorReturnType => {
    const parts = [
        message,
        namespace ? `Namespace: "${namespace}"` : '',
        key ? `Key: "${key}"` : '',
        `Locale: "${locale}"`,
    ].filter(Boolean); // Filter out empty parts
    console.warn(parts.join(' | '));

    const fallbackFn = (k: string) => k; // Fallback function simply returns the key
    translationFunctionsCache.set(cacheKey, fallbackFn);
    return fallbackFn;
};

/**
 * Loads and caches messages for a specific locale using dynamic import.
 * Prevents redundant file loads and handles import errors gracefully.
 * @param locale The locale for which to load messages.
 * @returns A promise that resolves to the TranslationObject for the given locale.
 */
export async function loadMessagesForLocale(locale: Language): Promise<TranslationObject> {
    if (!loadedTranslations.has(locale)) {
        try {
            // Dynamic import ensures that translation files are only loaded when needed.
            // The `default` export is used as per typical JSON module imports.
            const messages = (await import(`../../../messages/${locale}.json`)).default as TranslationObject;
            loadedTranslations.set(locale, messages);
        } catch (error) {
            console.error(`Failed to load translations for locale "${locale}":`, error);
            // Cache an empty object for failed locales to prevent repeated failed attempts.
            loadedTranslations.set(locale, {});
            return {};
        }
    }
    return loadedTranslations.get(locale)!; // Assert non-null because it's guaranteed to be in the map
}

/**
 * Retrieves a translation function for a specific namespace and locale.
 * This function handles caching of both translation files and memoized translation functions.
 * @param namespace The dot-separated namespace (e.g., "common.buttons").
 * @param locale Optional: The specific locale to use. If not provided, it will be determined.
 * @returns A promise that resolves to a function, which takes a key and returns the translated string.
 */
export async function getTranslations(namespace: string, locale?: Language): Promise<TranslatorReturnType> {
    // Determine the effective locale, awaiting getLocale only if not provided.
    const effectiveLocale = locale ?? (await getLocale());
    const cacheKey = `${effectiveLocale}-${namespace}`;

    // Return cached translation function immediately if available.
    if (translationFunctionsCache.has(cacheKey)) {
        return translationFunctionsCache.get(cacheKey)!;
    }

    // Load messages for the effective locale. This also benefits from caching.
    const serverMessages = await loadMessagesForLocale(effectiveLocale);

    return getTranslationsImpl(effectiveLocale, serverMessages, namespace, cacheKey);
}

export function getTranslationsImpl(locale: Language, messages: TranslationObject, namespace: string, cacheKey?: string): TranslatorReturnType {
    const cacheKeyValue = cacheKey ?? `${locale}-${namespace}`;
    const namespaceParts = namespace.split('.');
    let currentLevel: TranslationEntry | TranslationObject = messages;
    let translationsBase: TranslationObject | undefined;

    // Traverse the translation object based on the namespace parts.
    for (let i = 0; i < namespaceParts.length; i++) {
        const part = namespaceParts[i];

        if (typeof currentLevel === 'string') {
            // Namespace path prematurely leads to a string.
            return warnAndReturnFallback(
                `Namespace "${namespace}" leads to a string prematurely at "${part}".`,
                cacheKeyValue, locale, namespace
            );
        }

        const nextLevel: TranslationEntry | undefined = currentLevel[part];

        if (i === namespaceParts.length - 1) {
            // Last part of the namespace, should resolve to an object (the base for translations).
            if (typeof nextLevel === 'object' && nextLevel !== null) {
                translationsBase = nextLevel;
            } else {
                // Namespace does not resolve to an object as expected.
                return warnAndReturnFallback(
                    `Namespace "${namespace}" does not resolve to an object.`,
                    cacheKeyValue, locale, namespace
                );
            }
        } else {
            // Intermediate part of the namespace, must be an object.
            if (typeof nextLevel === 'object' && nextLevel !== null) {
                currentLevel = nextLevel;
            } else {
                // Invalid structure in the middle of the namespace path.
                return warnAndReturnFallback(
                    `Namespace "${namespace}" has invalid structure at "${part}". Expected object, got "${typeof nextLevel}".`,
                    cacheKeyValue, locale, namespace
                );
            }
        }
    }

    // If after traversal, no base translations object was found.
    if (!translationsBase) {
        return warnAndReturnFallback(
            `Translations for namespace "${namespace}" could not be found.`,
            cacheKeyValue, locale, namespace
        );
    }

    /**
     * The actual translation function for a given key within the resolved namespace.
     * @param key The dot-separated translation key (e.g., "title", "description.long").
     * @returns The translated string or the key itself if not found/invalid.
     */
    const translateFunction = (key: string): string => {
        const keyParts = key.split('.');
        let currentTranslation: TranslationEntry | TranslationObject = translationsBase;

        // Traverse the resolved translations base using the key parts.
        for (let i = 0; i < keyParts.length; i++) {
            const part = keyParts[i];

            if (typeof currentTranslation === 'string') {
                // Translation key path prematurely leads to a string.
                console.warn(`Translation key "${key}" in namespace "${namespace}" leads to a string prematurely at "${part}" for locale "${locale}".`);
                return key; // Return the key as fallback
            }

            const value: TranslationEntry = currentTranslation[part];

            if (i === keyParts.length - 1) {
                // Last part of the key, should be the final string translation.
                if (typeof value === 'string') {
                    return value;
                }
            } else {
                // Intermediate part of the key, must be an object.
                if (typeof value === 'object' && value !== null) {
                    currentTranslation = value;
                } else {
                    // Invalid structure in the middle of the translation key path.
                    console.warn(`Translation key "${key}" in namespace "${namespace}" has invalid structure at "${part}" for locale "${locale}". Expected object, got "${typeof value}".`);
                    return key; // Return the key as fallback
                }
            }
        }

        // If the loop completes and no string translation was found (e.g., key missing or not a string).
        console.warn(`Translation key "${key}" in namespace "${namespace}" is missing or not a string for locale "${locale}".`);
        return key; // Return the key as fallback
    };

    translationFunctionsCache.set(cacheKeyValue, translateFunction);
    return translateFunction;
}

/**
 * Determines the current locale. It first checks for an explicitly set locale,
 * and finally reads from cookies.
 * @returns A promise that resolves to the determined Language.
 */
export async function getLocale(): Promise<Language> {
    // If locale is already set (e.g., via setLocale), return it immediately.
    if (currentLanguage) {
        return currentLanguage;
    }

    try {
        // Dynamically import "next/headers" only when needed.
        // This ensures it's loaded only on the server where cookies are accessible,
        // preventing client-side import errors and reducing bundle size.
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const localeCookie = cookieStore.get(CookieKey.localeCookieName);
        // Use the cookie value or fall back to the default locale.
        const localeValue = (localeCookie?.value as Language) ?? KTextConstants.defaultLocale;
        currentLanguage = localeValue; // Cache the resolved language for future synchronous access
        return localeValue;
    } catch (error) {
        console.error("Error accessing cookies in getLocale, falling back to default:", error);
        currentLanguage = KTextConstants.defaultLocale; // Cache fallback language on error
        return KTextConstants.defaultLocale;
    }
}
