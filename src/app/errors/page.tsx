import Link from "next/link";
import { errorsAccess } from "./gate";
import { loadErrorsBoard, parseErrorsListFilters } from "cloudflare-next-intl/errorsBoard";
import ErrorsStatStrip from "cloudflare-next-intl/ErrorsStatStrip";
import ErrorsFilterForm from "cloudflare-next-intl/ErrorsFilterForm";
import ErrorsListClient from "cloudflare-next-intl/ErrorsListClient";
import ErrorsLoginPage from "./login_page";
import * as actions from "./actions";
import KTextConstants from "@/shared/constants/variables/text_constants";

export const dynamic = "force-dynamic";

interface SearchParams {
    flavour?: string;
    status?: string;
    q?: string;
}

export default async function ErrorsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}): Promise<Component | null> {
    if (KTextConstants.isBuild) return null;
    if (!(await errorsAccess.hasAccess())) return <ErrorsLoginPage />;

    const resolvedSearchParams = await searchParams;
    const filters = parseErrorsListFilters({
        flavour: resolvedSearchParams.flavour ?? "all",
        status: resolvedSearchParams.status ?? "new",
        q: resolvedSearchParams.q ?? "",
    });

    // Dynamic import: `cloudflare:workers` only resolves inside workerd —
    // a static top-level import would crash vinext's Node-based prerender.
    const { env } = await import("cloudflare:workers");
    const db = env?.ERRORS_DB;

    if (!db) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-10">
                <p className="text-red-600 dark:text-red-400">ERRORS_DB binding is not configured.</p>
            </main>
        );
    }

    let board: Awaited<ReturnType<typeof loadErrorsBoard>>;

    try {
        // One D1 batch round-trip for list + flavours + counts.
        board = await loadErrorsBoard(db, filters);
    } catch (error) {
        return (
            <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-2 px-4 py-10 text-center">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Failed to load errors</p>
                <p className="max-w-md text-xs text-gray-500 dark:text-gray-400">{String(error)}</p>
            </main>
        );
    }

    function linkFor(status: string): string {
        const params = new URLSearchParams({ flavour: filters.flavour, status, q: filters.q });
        return `/errors?${params.toString()}`;
    }

    return (
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-5 px-4 py-8">
            <div>
                <Link
                    href="/"
                    className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                    ← Back home
                </Link>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Error log</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Reported errors across all flavours, newest first.</p>
            </div>

            <ErrorsStatStrip counts={board.counts} activeStatus={filters.status} linkFor={linkFor} />

            <ErrorsFilterForm
                key={`${filters.flavour}|${filters.status}|${filters.q}`}
                flavours={board.flavours}
                filters={filters}
            />

            <ErrorsListClient
                key={`${filters.flavour}|${filters.status}|${filters.q}`}
                initialRows={board.rows}
                initialNextCursor={board.nextCursor}
                filters={filters}
                actions={actions}
                hrefFor={(id) => `/errors/${id}`}
            />
        </main>
    );
}
