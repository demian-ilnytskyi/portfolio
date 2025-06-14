export default abstract class KTextConstants {
    static readonly isDevENV = process.env.NEXT_PUBLIC_FLAVOUR === "development";
    static readonly isDev = process.env.NODE_ENV === "development";
    static readonly currentDate = new Date();
    static readonly owner = "Demian Ilnutskyi";
    static readonly ownerUrl = "---";
    static readonly defaultLocale: Language = "en";
    static readonly locales: Language[] = ["uk", "en"];
    static readonly localesSet = new Set(KTextConstants.locales);
    static readonly baseUrl =
        KTextConstants.isDevENV
            ? "http://localhost:3000"
            : process.env.NEXT_PUBLIC_FLAVOUR == 'development'
                ? "https://dev.--.info"
                : "https://--.info";
    // static readonly discountsLink = '/discounts';
}