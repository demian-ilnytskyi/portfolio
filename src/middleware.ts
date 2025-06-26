import type { NextRequest } from 'next/server';
import type { NextResponse } from 'next/server';
import { intlMiddleware } from 'optimized-next-intl';

// This middleware function runs for every incoming request
export async function middleware(request: NextRequest): Promise<NextResponse<unknown>> {
    return await intlMiddleware(request);
}

// Configuration for the middleware
export const config = {
    // Define the paths the middleware should apply to
    matcher: [
        {
            // Apply to all paths except API routes, Next.js static files,
            // Next.js image optimization URLs, and the favicon.ico
            source: '/((?!api|_next/static|_next/image|favicon\\.ico|icons|images|uk/*.md|en/*.md|sitemap\\.xml|robots\\.txt|\\.well-known|healthz|.*\\/manifest\\.json$).*)',
            // Also exclude requests that are typically for prefetching
            // This prevents the middleware from running unnecessarily for prefetched links
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
    ],
};
