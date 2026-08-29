import type { ErrorHandlingParams } from "cloudflare-next-intl/errorHandling";
import { env } from "cloudflare:workers";
import { getAuthUser } from "cloudflare-next-intl/getFirebaseAuthUser";
import KTextConstants from "../constants/variables/text_constants";
import errorsRepository from "../repositories/errors_repository";

function stringifyParams(params: unknown): string | null {
    if (params === undefined) return null;
    try {
        return JSON.stringify(params);
    } catch {
        return null;
    }
}

async function resolveUserEmail(): Promise<string | null> {
    try {
        const { user } = await getAuthUser();
        return user?.email ?? null;
    } catch {
        // getAuthUser is Server Component/Action only — some error paths
        // (e.g. a waitUntil-deferred callback, or outside any request scope)
        // don't have that context, so this simply means "no user known".
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
        const db = env?.ERRORS_DB;
        if (!db) return;

        const error = params.error;
        const message = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack ?? null : null;
        const userEmail = await resolveUserEmail();

        await errorsRepository.record(db, {
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
