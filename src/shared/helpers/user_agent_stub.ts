export function isBot(input?: string | null): boolean {
    if (!input) return false;
    return /Googlebot|Mediapartners-Google|AdsBot-Google|googleweblight|Storebot-Google|Google-PageRenderer|Google-InspectionTool|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|LinkedInBot|bitlybot|tumblr|vkShare|quora link preview|facebookexternalhit|facebookcatalog|Twitterbot|applebot|redditbot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|ia_archiver|GPTBot/i.test(
        input
    );
}

export function userAgentFromString(input?: string) {
    return {
        ua: input ?? "",
        browser: { name: undefined, version: undefined, major: undefined },
        cpu: { architecture: undefined },
        device: { model: undefined, type: undefined, vendor: undefined },
        engine: { name: undefined, version: undefined },
        os: { name: undefined, version: undefined },
        isBot: input === undefined ? false : isBot(input),
    };
}

export function userAgent({ headers }: { headers: Headers }) {
    return userAgentFromString(headers.get("user-agent") ?? undefined);
}

export default {
    isBot,
    userAgent,
    userAgentFromString,
};
