export default abstract class CookieKey {
    static readonly clearCacheCookieKey = '__clear_cache_key__';
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