import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import KTextConstants from './shared/constants/variables/text_constants';
import getMatchingLocaleFromAcceptLanguage from './shared/helpers/language_detect_helper';
import CookieKey from './shared/constants/variables/cookie_key';

declare global {
    type Language = 'uk' | 'en';
}

const sameSite: true | false | "lax" | "strict" | "none" | undefined = 'lax';

const cookieSetOption = {
    path: '/', // Cookie is valid for the entire domain
    maxAge: 2592000, // Store cookie for 30 days (in seconds).
    httpOnly: true, // Recommended for security (prevents client-side script access)
    secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
    sameSite: sameSite, // Protection against CSRF attacks. 'strict' or 'lax' are good choices.
};

async function getIsBotValue(userAgent: string | null): Promise<boolean> {
    if (userAgent === null) return false;
    const { isBot } = await import('next/dist/server/web/spec-extension/user-agent');
    return isBot(userAgent ?? '');
}

// This middleware function runs for every incoming request
export async function middleware(request: NextRequest): Promise<NextResponse<unknown>> {
    try {
        let initialChosenLocale: Language;
        const existingLocaleCookie = request.cookies.get(CookieKey.localeCookieName)?.value as Language | undefined;

        let isSEOBot: boolean | undefined = undefined;

        // console.log('dsfdfsdfsdsf @@@@@ ',existingLocaleCookie);

        // 1. The most performant step: Check if a locale cookie is already set
        // Also, verify if the value from this cookie is actually supported
        if (existingLocaleCookie && KTextConstants.localesSet.has(existingLocaleCookie)) {
            initialChosenLocale = existingLocaleCookie as Language;
        } else {
            const userAgent = request.headers.get('user-agent');
            isSEOBot = await getIsBotValue(userAgent);
            // 2. Fallback: Determine the locale from the Accept-Language header
            // Use KTextConstants.localesSet, which contains your supported languages (e.g., ["uk", "en"])
            initialChosenLocale = isSEOBot ? KTextConstants.defaultLocale : getMatchingLocaleFromAcceptLanguage(
                request.headers.get('accept-language'),
            );
        }

        const { pathname, search, hash } = request.nextUrl;

        let urlLocale: Language | undefined;
        let pathWithoutLocale: string;

        const pathSegments = pathname.split('/').filter(Boolean); // e.g., ['', 'en', 'about'] -> ['en', 'about']
        const firstSegment = pathSegments[0];
        const languageValue = firstSegment as Language;

        // Check if the first segment of the path is one of the supported locales
        if (pathSegments.length > 0 && KTextConstants.localesSet.has(languageValue)) {
            urlLocale = languageValue;
            pathWithoutLocale = '/' + pathSegments.slice(1).join('/'); // Remove the locale segment
            if (pathWithoutLocale === '') pathWithoutLocale = '/'; // Ensure it's '/' for root after removing locale
        } else {
            // No locale prefix in the URL. The actual pathname is the full original pathname.
            pathWithoutLocale = pathname;
        }

        const effectiveLocaleForRequest: Language = urlLocale || initialChosenLocale;

        let response: NextResponse;

        if (!urlLocale) {
            const targetPath = `/${effectiveLocaleForRequest}${pathWithoutLocale}`;
            const targetUrl = new URL(`${targetPath}${search}${hash}`, request.url);
            if (initialChosenLocale === KTextConstants.defaultLocale) {
                response = NextResponse.rewrite(targetUrl, { request });
            } else {

                response = NextResponse.redirect(targetUrl, request,);
            }
        } else {
            // if (urlLocale === KTextConstants.defaultLocale) {
            //     const redirectToUrl = new URL(`${pathWithoutLocale ? pathWithoutLocale : '/'}`, request.url);
            //     response = NextResponse.redirect(redirectToUrl, request);
            //     shouldRedirect = true;
            // } else {
            response = NextResponse.next({
                request,
            });
            // }
        }

        if (!existingLocaleCookie ||
            existingLocaleCookie !== effectiveLocaleForRequest ||
            (urlLocale && urlLocale !== effectiveLocaleForRequest)) {

            response.cookies.set(CookieKey.localeCookieName, urlLocale ? urlLocale : effectiveLocaleForRequest, cookieSetOption);

            if (isSEOBot !== undefined) {
                response.cookies.set(CookieKey.isBotCookieKey, isSEOBot.toString(), {
                    ...cookieSetOption,
                    maxAge: 31536000, // 1 year
                });
            }
        }

        // const response = handleI18nRouting(request);
        // if (process.env.NODE_ENV === "development") {
        //     return undefined;
        // }
        // Generate a unique nonce value for the Content Security Policy
        // A nonce is a cryptographically secure single-use token
        // const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

        // Define the Content Security Policy header value
        // This policy restricts the sources from which resources can be loaded
        // const cspDirectives = [
        //     // Default policy: Allow resources only from the origin ('self').
        //     `default-src 'self'`,

        //     // Scripts: Allow from 'self', sources with the correct nonce, dynamically added scripts ('strict-dynamic'),
        //     // specific Google scripts (via hashes), and the general allowed list.
        //     // 'strict-dynamic' allows scripts loaded by trusted (nonced) scripts to execute.
        //     // Hashes are for specific inline scripts (e.g., Google Tag Manager snippets).
        //     `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${scriptHashesList} ${generalSrcList}`,

        //     // Images: Allow from 'self', blob URLs, data URIs, and the general allowed list.
        //     `img-src 'self' blob: data: ${generalSrcList}`,

        //     // Connections (fetch, XHR, WebSockets): Allow from 'self' and the general allowed list.
        //     `connect-src 'self' ${generalSrcList}`,

        //     // Frames: Allow framing only from 'self' and the general allowed list.
        //     // Consider if framing from external Google services is necessary.
        //     `frame-src 'self' ${generalSrcList}`,

        //     `fenced-frame-src 'self' ${generalSrcList}`,

        //     // Fonts: Allow only from 'self'. Adjust if using external font providers.
        //     `font-src 'self'`,

        //     // Styles: Allow from 'self' and inline styles ('unsafe-inline').
        //     // WARNING: 'unsafe-inline' is generally discouraged for styles.
        //     // Prefer using CSS Modules, Tailwind, styled-components, or hashes for inline styles if possible.
        //     // It's often needed for UI libraries that inject styles dynamically.
        //     `style-src 'self' 'unsafe-inline'`,

        //     // Objects (e.g., <object>, <embed>): Disallow ('none'). Generally recommended.
        //     `object-src 'none'`,

        //     // Base URI: Restricts the <base> tag to 'self'.
        //     `base-uri 'self'`,

        //     // Form Actions: Allow form submissions only to 'self'.
        //     `form-action 'self'`,

        //     // Frame Ancestors: Prevent clickjacking by disallowing embedding in frames from other origins.
        //     // 'self' allows embedding in frames from the same origin. Use 'none' to prevent all framing.
        //     `frame-ancestors 'self'`, // Changed from X-Frame-Options: DENY as this is the modern approach

        //     // Upgrade Insecure Requests: Tells browsers to request HTTPS versions of HTTP resources.
        //     // `upgrade-insecure-requests`,
        // ];

        // Join directives into a single header string.
        // const contentSecurityPolicyHeaderValue = cspDirectives.join('; ');

        // Create a mutable copy of the request headers
        // const requestHeaders = new Headers(request.headers);

        // Set a custom header 'x-nonce' on the request headers.
        // This nonce can be accessed in API routes or server-side rendering
        // to embed it in script/style tags for CSP compliance.
        // requestHeaders.set('x-nonce', nonce);

        // Create a new response object, passing the modified request headers
        // The 'request' property in NextResponse.next allows passing modified headers
        // to the subsequent stages of the request handling lifecycle (e.g., page/api routes).

        // Set the Content-Security-Policy header on the response
        // response.headers.set(
        //     'Content-Security-Policy',
        //     contentSecurityPolicyHeaderValue
        // );

        response.headers.set('Content-Language', effectiveLocaleForRequest);

        // Return the modified response
        return response;
    } catch (e) {
        console.error('Middleware Error ', e);
        return NextResponse.next({
            request,
        });
    }
}

// Configuration for the middleware
export const config = {
    // Define the paths the middleware should apply to
    matcher: [
        {
            // Apply to all paths except API routes, Next.js static files,
            // Next.js image optimization URLs, and the favicon.ico
            source: '/((?!api|_next/static|_next/image|favicon\\.ico|icons|images|uk|en|sitemap\\.xml|robots\\.txt|\\.well-known|healthz|.*\\/manifest\\.json$).*)',
            // Also exclude requests that are typically for prefetching
            // This prevents the middleware from running unnecessarily for prefetched links
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
    ],
};
