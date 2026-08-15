import KTextConstants from "@/shared/constants/variables/text_constants";
import { setIntlConfig } from "cloudflare-next-intl/setIntlConfig";
import errorRepository from "@/shared/repositories/error_repository";
import cloudflareRepository from "@/shared/repositories/cloudflare_repository";

declare global {
    type Language = "uk" | "en";
}

const intlConfig = setIntlConfig({
    locales: KTextConstants.locales,
    defaultLocale: KTextConstants.defaultLocale,
    generate: {
        getCloudflareContext: cloudflareRepository.getContext.bind(cloudflareRepository),
    },
    errorHandling: {
        onError: (params) => {
            errorRepository.sendErrorReport({
                classOrMethodName: params.classOrMethodName,
                error: params.error,
                params: params.params as Record<string, unknown>,
                isClient: params.isClient,
            });
        },
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

