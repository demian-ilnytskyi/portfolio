import { cookies } from "next/headers";
import dynamic from 'next/dynamic'
import KTextConstants from "@/shared/constants/variables/text_constants";


const CookieDialogComponent = dynamic(() =>
    import('./cookie_dialog_component')
)

const CookieAnalyticsComponent = dynamic(() =>
    import('./cooke_analytics_component')
)

export default async function CookieHook(): Promise<Component | null> {
    let state: boolean | null = null;
    try {
        const cookie = await cookies();
        // Disable Cookie dialog for SEO bot. It's recomandation from google.
        const isBot = cookie.get(KTextConstants.isBotCookieKey);
        if (getCookieBooleanValue(isBot?.value) === true) {
            return null;
        }
        const repository = cookie.get(KTextConstants.analyticsCookieKey);;
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
