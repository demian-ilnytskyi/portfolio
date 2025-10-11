
import { isDarkCookieKey, localeCookieName } from "optimized-next-intl";
import type { JSX } from "react";
import KTextConstants from "../constants/variables/text_constants";

export default function HelperScriptTest(): JSX.Element | null {
    if (process.env.NODE_ENV === "development") return null;
    return <script
        id="app-state-checker"
        dangerouslySetInnerHTML={{
            __html: `
      (function() {
        try {
            /**
             * Efficiently retrieves a cookie value by its name.
             * @param {string} name - The name of the cookie to retrieve.
             * @returns {string|null} - The decoded cookie value or null if not found.
             */
            const getCookie = (name) => {
                // Use a regex to find the cookie directly, avoiding splits and loops.
                // The non-capturing group (?:^|; ) matches the start of the string or a '; '
                // to ensure we're not matching a substring of another cookie's name.
                const match = document.cookie.match(new RegExp(\`(?:^|; )\${name}=([^;]*)\`));
                return match ? decodeURIComponent(match[1]) : null;
            };

            // 1. Get cookie values directly and efficiently.
            const locale = getCookie('${localeCookieName}');
            const isDarkValue = getCookie('${isDarkCookieKey}');
            console.log('dsfdfsdfsdfsdfsdfs',isDarkValue);

            // 2. Handle Dark Mode.
            // This block is self-contained and only runs if the cookie exists.
            if (isDarkValue !== null) {
                const isDarkBool = isDarkValue === 'true';
                // This check is efficient as it only touches the DOM when a change is needed.
                if (document.documentElement.classList.contains('dark') !== isDarkBool) {
                    document.documentElement.classList.toggle('dark', isDarkBool);
                }
            }

            // 3. Handle Locale Redirect.
            // The logic is clearer: redirect only if a non-default locale is set
            // and the URL isn't already localized.
            const { pathname } = window.location;
            if (locale && locale !== '${KTextConstants.defaultLocale}' && !pathname.startsWith(\`/\${locale}\`)) {
                const newPath = \`/\${locale}\${pathname === '/' ? '' : pathname}\`;
                // Redirecting will stop further script execution on this page.
                window.location.href = newPath;
            }

        } catch (e) {
            console.error('App State check Script Error:', e);
        }
      })();
    `,
        }}
    />;
}