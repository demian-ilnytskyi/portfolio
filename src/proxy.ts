import intlMiddleware from "cloudflare-next-intl/middleware";

export const proxy = intlMiddleware;

export const config = {
    matcher: [
        {
            source:
                "/((?!_next/static|_next/image|favicon\\.ico|icons|images|uk/*.md|en/*.md|sitemap\\.xml|robots\\.txt|BUILD_ID|.*\\/manifest\\.json$).*)",
            missing: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        },
    ],
};
