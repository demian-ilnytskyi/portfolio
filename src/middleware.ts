import { intlMiddleware } from 'optimized-next-intl';

export const middleware = intlMiddleware;

// Configuration for the middleware
export const config = {
    // Define the paths the middleware should apply to
    matcher: [
        {
            // Apply to all paths except API routes, Next.js static files,
            // Next.js image optimization URLs, and the favicon.ico
            source: '/((?!api|_next/static|_next/image|favicon\\.ico|icons|images|uk/*.md|en/*.md|sitemap\\.xml|robots\\.txt|\\.well-known|healthz|config\\.json|test_script\\.js|₴.*\\/manifest\\.json$).*)',
            // Also exclude requests that are typically for prefetching
            // This prevents the middleware from running unnecessarily for prefetched links
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
    ],
};
