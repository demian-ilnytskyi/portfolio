import dynamic from 'next/dynamic'
import CookieKey from "@/shared/constants/variables/cookie_key";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";


const CookieDialogComponent = dynamic(() =>
    import('./cookie_dialog_component')
)

const CookieAnalyticsComponent = dynamic(() =>
    import('./cooke_analytics_component')
)

export default async function CookieHook({ cookie }: { cookie: ReadonlyRequestCookies }): Promise<Component | null> {
    let state: boolean | null = null;
    try {
        // Disable Cookie dialog for SEO bot. It's recomandation from google.
        const isBot = cookie.get(CookieKey.isBotCookieKey);
        if (getCookieBooleanValue(isBot?.value) === true) {
            return null;
        }
        const repository = cookie.get(CookieKey.analyticsCookieKey);;
        state = getCookieBooleanValue(repository?.value);
    } catch (e) {
        console.warn('Get Cookie Error ', e);
    }
    if (state === null) {
        return <CookieDialogComponent />;
    } else {
        return <CookieAnalyticsComponent state={state} />;
    }
}

function getCookieBooleanValue(cookieValue: string | undefined): boolean | null {
    switch (cookieValue) {
        case "true":
            return true;
        case "false":
            return false;
        default:
            return null;
    }
}
