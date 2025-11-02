'use client'

import Script from "next/script";
import { useEffect, useState } from "react";
import { allowAnalytics } from "../helpers/analytics_helper";
import getCookie from "optimized-next-intl/getCookieClient";
import CookieKey, { getCookieBooleanValue } from "../constants/variables/cookie_key";
import setCookie from "optimized-next-intl/setCookieClient";

export default function CloudflareAnalyticsScript(): Component | null {
    const [show, setState] = useState(false);
    useEffect(() => {
        async function fetchState() {
            const result = await allowAnalytics();
            setState(result);

            setCookie({ name: CookieKey.allowAnalyticsCookieKey, value: result });
        }
        const isEU = getCookieBooleanValue(getCookie(CookieKey.allowAnalyticsCookieKey));
        if (isEU === null) {
            fetchState();
        } else {
            setState(isEU);
        }
    }, [])

    if (show) {
        return <Script
            defer
            src='https://static.cloudflareinsights.com/beacon.min.js'
            data-cf-beacon='{"token": "e1c02e761c374b7dbc4c4bf72061abcf"}'
            strategy="afterInteractive" />;
    } else {
        return null;
    }
}