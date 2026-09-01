"use server";

import { createErrorsActions } from "cloudflare-next-intl/errorsBoard";
import { errorsAccess } from "./gate";

async function getDb(): Promise<D1Database> {
    // Dynamic import: `cloudflare:workers` only resolves inside workerd —
    // a static top-level import would crash vinext's Node-based prerender.
    const { env } = await import("cloudflare:workers");
    const db = env?.ERRORS_DB;
    if (!db) throw new Error("ERRORS_DB binding is not available");
    return db;
}

export const { loadErrors, setErrorStatus, deleteErrors, deleteAllResolved } = createErrorsActions({
    getDb,
    requireAccess: errorsAccess.requireAccess,
});

export async function login(password: string): Promise<boolean> {
    if (!(await errorsAccess.verifyPassword(password))) return false;
    await errorsAccess.setAuthCookie();
    return true;
}
