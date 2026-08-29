import KTextConstants from "@/shared/constants/variables/text_constants";
import { setIntlConfig } from "cloudflare-next-intl/setIntlConfig";
import onError from "@/shared/error_handling/on_error";
import { env } from "cloudflare:workers";
import { getRequestExecutionContext } from "vinext/shims/request-context";

declare global {
    type Language = "uk" | "en";
}

const intlConfig = setIntlConfig({
    locales: KTextConstants.locales,
    defaultLocale: KTextConstants.defaultLocale,
    generate: {
        env: env as unknown as Record<string, unknown>,
        ctx: () => getRequestExecutionContext() ?? undefined,
    },
    errorHandling: {
        onError: onError,
        overrideConsoleError: true,
    },
    cookieConsent: {
        analytics: {
            cloudflareBeaconToken: '{"token": "e1c02e761c374b7dbc4c4bf72061abcf"}',
            clarityProjectId: "xd837xknfq",
        },
    },
});
export default intlConfig;
