import KTextConstants from "../constants/variables/text_constants";

export default function CloudflareAnalyticsScript(): Component | null {
    if (KTextConstants.isDevENV) return null;
    return <script
        defer
        src='https://static.cloudflareinsights.com/beacon.min.js'
        data-cf-beacon='{"token": "e1c02e761c374b7dbc4c4bf72061abcf"}' />;
}