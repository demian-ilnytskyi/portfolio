export default abstract class KTextConstants {
    static readonly isDevENV = process.env.NEXT_PUBLIC_FLAVOUR === "development";
    static readonly isDev = process.env.NODE_ENV === "development";
    static readonly currentDate = new Date();
    static readonly owner = "Demian Ilnutskyi";
    static readonly ownerUrl = "---";
    static readonly defaultLocale: Language = "uk";
    static readonly locales: Language[] = ["uk", "en"];
    static readonly localesSet = new Set(KTextConstants.locales);
    static readonly baseUrl =
        KTextConstants.isDevENV
            ? "http://localhost:3000"
            : process.env.NEXT_PUBLIC_FLAVOUR == 'development'
                ? "https://dev.--.info"
                : "https://--.info";
    // static readonly discountsLink = '/discounts';

    static readonly analyticsCookieKey = '__analytics_agreed_key__';
    static readonly isBotCookieKey = '__is_bot_key__';
    static readonly clearCacheCookieKey = '__clear_cache_key__';
}