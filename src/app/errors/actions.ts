"use server";

import { revalidatePath } from "next/cache";
import { hasErrorsAccess, verifyErrorsPassword, setErrorsAuthCookie } from "./gate";
import { notFound } from "next/navigation";

async function requireErrorsAccess(): Promise<void> {
    if (!(await hasErrorsAccess())) notFound();
}
import errorsRepository, {
    errorIdsSchema,
    errorStatusSchema,
    errorsListParamsSchema,
    type ErrorRow,
} from "@/shared/repositories/errors_repository";

export async function loginToErrors(password: string): Promise<boolean> {
    if (!(await verifyErrorsPassword(password))) return false;
    await setErrorsAuthCookie();
    return true;
}

async function getDb(): Promise<D1Database> {
    // Dynamic import: `cloudflare:workers` only resolves inside workerd —
    // a static top-level import would crash vinext's Node-based prerender.
    const { env } = await import("cloudflare:workers");
    const db = env?.ERRORS_DB;
    if (!db) throw new Error("ERRORS_DB binding is not available");
    return db;
}

export async function loadErrors(rawParams: {
    flavour?: string;
    status?: string;
    q?: string;
    cursor?: number | null;
}): Promise<{ rows: ErrorRow[]; nextCursor: number | null }> {
    await requireErrorsAccess();
    const filters = errorsListParamsSchema.parse(rawParams);

    const db = await getDb();
    return errorsRepository.list(db, filters);
}

export async function setErrorStatus(rawIds: number[], rawStatus: string): Promise<void> {
    await requireErrorsAccess();
    const ids = errorIdsSchema.parse(rawIds);
    const status = errorStatusSchema.parse(rawStatus);

    const db = await getDb();
    await errorsRepository.setStatus(db, ids, status);
    revalidatePath("/errors");
}

export async function deleteErrors(rawIds: number[]): Promise<void> {
    await requireErrorsAccess();
    const ids = errorIdsSchema.parse(rawIds);

    const db = await getDb();
    await errorsRepository.deleteByIds(db, ids);
    revalidatePath("/errors");
}

export async function deleteAllResolved(): Promise<void> {
    await requireErrorsAccess();

    const db = await getDb();
    await errorsRepository.deleteAllResolved(db);
    revalidatePath("/errors");
}
