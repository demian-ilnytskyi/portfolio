export default abstract class CookieKey {
    static readonly isDarkCookieKey = '__is_dark_key__';
    static readonly analyticsCookieKey = '__analytics_agreed_key__';
    static readonly isBotCookieKey = '__is_bot_key__';
    static readonly clearCacheCookieKey = '__clear_cache_key__';
    static readonly localeCookieName = '__user_locale_key__'

}
export function getCookieBooleanValue(cookieValue: string | undefined): boolean | null {
    switch (cookieValue) {
        case "true":
            return true;
        case "false":
            return false;
        default:
            return null;
    }
}