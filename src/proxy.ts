import type { NextRequest, NextResponse } from "next/server";
import { intlMiddleware } from "cloudflare-next-intl";

export async function proxy(request: NextRequest): Promise<NextResponse<unknown>> {
    const cf = (request as NextRequest & { cf?: IncomingRequestCfProperties }).cf;

    if (cf) {
        if (typeof cf.country === "string") request.headers.set("x-cf-country", cf.country);
        if (typeof cf.timezone === "string") request.headers.set("x-cf-timezone", cf.timezone);
    }

    return intlMiddleware(request);
}

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
