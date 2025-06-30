import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import path from 'path';

const isDev = process.env.NODE_ENV === "development";

/**
 * Generates a Cache-Control header value.
 * @param seconds The maximum age for the cache in seconds.
 * @returns A Cache-Control header string.
 */
function cacheHeader(seconds: number) {
    return isDev ? 'no-store' : `public, max-age=${seconds}, must-revalidate, stale-while-revalidate=120, stale-if-error=86400`;
}

const nextConfig: NextConfig = {
    webpack(config) {
        config.resolve.alias = {
            ...config.resolve.alias,
            "@intl-config": path.resolve(__dirname, "src/l18n/intl_config"),
            "@locale-file": path.resolve(__dirname, "messages"),
        };
        return config;
    },
    compiler: {
        removeConsole: isDev ? undefined : {
            exclude: ["error", "warn"],
        },
    },
    async headers() {
        return [
            {
                // Apply these headers to all paths.
                source: '/:path*',
                headers: [
                    // Set the X-Content-Type-Options header to 'nosniff'.
                    // This prevents browsers from MIME-sniffing a response away from the declared content-type, enhancing security.
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    // Set the X-Frame-Options header to 'DENY'.
                    // This prevents the page from being displayed in a frame (iframe, frame, object, etc.), mitigating clickjacking attacks.
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    // Set the Strict-Transport-Security header.
                    // This header tells browsers to only access the site using HTTPS for a specified duration (63072000 seconds = 2 years),
                    // include subdomains, and mark the domain for preloading, ensuring secure connections.
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    // Set the Cache-Control header to manage how the response is cached.
                    // 'public': Response can be cached by any cache.
                    // 'max-age=86400': Response is fresh for 7 days.
                    // 'must-revalidate': Cache must revalidate stale responses with the server.
                    // 'stale-while-revalidate=120': Allows serving stale content for up to 120 seconds while revalidating in the background.
                    // 'stale-if-error=86400': Allows serving stale content for up to 1 day if the server is unreachable or returns an error.
                    {
                        key: 'Cache-Control',
                        value: cacheHeader(604800),
                    },
                    // Set the X-DNS-Prefetch-Control header to 'on'.
                    // This enables DNS prefetching, allowing the browser to resolve domain names in advance, improving perceived performance.
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    // Set the Referrer-Policy header to 'origin-when-cross-origin'.
                    // This policy sends the origin, path, and query string when making same-origin requests, but only the origin when making cross-origin requests.
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    }
                ],
            },
            {
                source: `/:locale([a-z]{2})?/projects`,
                headers: [
                    {
                        // Cache for 1 day (86400 seconds).
                        key: 'Cache-Control',
                        value: cacheHeader(86400),
                    },
                ]
            },
            {
                source: `/:locale([a-z]{2})?/projects/:path*`,
                headers: [
                    {
                        // Cache for 30 days (2592000 seconds).
                        key: 'Cache-Control',
                        value: cacheHeader(2592000),
                    },
                ]
            },
            {
                // Apply specific cache-control for the favicon.
                source: '/favicon.ico',
                headers: [
                    {
                        // Cache for 1 year (31536000 seconds) and mark as immutable (content will not change).
                        key: 'Cache-Control',
                        value: `${cacheHeader(31536000)}, immutable`,
                    },
                ],
            },
            {
                // Apply specific cache-control for icons.
                source: '/icons/:path*',
                headers: [
                    {
                        // Cache for 1 year (31536000 seconds) and mark as immutable.
                        key: 'Cache-Control',
                        value: `${cacheHeader(31536000)}, immutable`,
                    },
                ],
            },
            {
                // Apply specific cache-control for icons.
                source: '/images/:path*',
                headers: [
                    {
                        // Cache for 1 year (31536000 seconds) and mark as immutable.
                        key: 'Cache-Control',
                        value: `${cacheHeader(31536000)}, immutable`,
                    },
                ],
            },
            // No cache if happened error
            {
                source: '/:path*',
                has: [
                    {
                        type: 'cookie',
                        key: '__clear_cache_key__',
                        value: 'true',
                    },
                ],
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, must-revalidat',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;

initOpenNextCloudflareForDev();
