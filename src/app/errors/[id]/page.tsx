import { notFound } from "next/navigation";
import Link from "next/link";
import { hasErrorsAccess } from "../gate";
import errorsRepository from "@/shared/repositories/errors_repository";
import ErrorDetailView from "./error_detail_view";
import ErrorsLoginForm from "../login_form";
import KTextConstants from "@/shared/constants/variables/text_constants";

export const dynamic = "force-dynamic";

export default async function ErrorDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Component | null> {
    if (KTextConstants.isBuild) return null;

    if (!(await hasErrorsAccess())) return <ErrorsLoginForm />;

    const { id: rawId } = await params;
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) notFound();

    // Dynamic import: `cloudflare:workers` only resolves inside workerd —
    // a static top-level import would crash vinext's Node-based prerender.
    const { env } = await import("cloudflare:workers");
    const db = env?.ERRORS_DB;
    if (!db) {
        return (
            <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-2 px-4 py-10 text-center">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">ERRORS_DB binding is not configured.</p>
            </main>
        );
    }

    const row = await errorsRepository.getById(db, id);
    if (!row) notFound();

    return (
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-5 px-4 py-8">
            <Link
                href="/errors"
                className="inline-flex w-fit items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
                ← Back to error log
            </Link>
            <ErrorDetailView row={row} />
        </main>
    );
}
