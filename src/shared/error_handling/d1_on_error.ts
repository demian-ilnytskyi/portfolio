import type { ErrorHandlingParams } from "cloudflare-next-intl/errorHandling";
import { resolveErrorReportingUser } from "cloudflare-next-intl/resolveOptionalAuthUser";
import { recordError } from "cloudflare-next-intl/errorsBoard";
import KTextConstants from "../constants/variables/text_constants";

function stringifyParams(params: unknown): string | null {
    if (params === undefined) return null;
    try {
        return JSON.stringify(params);
    } catch {
        return null;
    }
}

/**
 * Writes every error reported through `errorHandling.onError` into the
 * ERRORS_DB D1 database. Must never throw and must never call `reportError`/`onError`
 * itself — this IS a sink of that hook, so any failure here can only be swallowed.
 */
export default async function d1OnError(params: ErrorHandlingParams): Promise<void> {
    if (KTextConstants.isDev || KTextConstants.isBuild) return;

    try {
        // Dynamic import: `cloudflare:workers` only resolves inside workerd —
        // a static top-level import would crash vinext's Node-based prerender.
        const { env } = await import("cloudflare:workers");
        const db = env?.ERRORS_DB;
        if (!db) return;

        const error = params.error;
        const message = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack ?? null : null;
        const { user } = await resolveErrorReportingUser(params.useAuthUser);
        const userEmail = user?.email ?? null;

        await recordError(db, {
            flavour: KTextConstants.flavour ?? "local",
            caller: params.classOrMethodName,
            message,
            stack,
            params: stringifyParams(params.params),
            isClient: params.isClient === true,
            userEmail,
        });
    } catch (error) {
        console.warn(`d1OnError failed to record error: ${error}`);
    }
}
