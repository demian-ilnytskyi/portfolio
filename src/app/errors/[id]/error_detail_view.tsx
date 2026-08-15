"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ErrorRow, ErrorStatus } from "@/shared/repositories/errors_repository";
import { setErrorStatus, deleteErrors } from "../actions";
import {
    STATUS_BADGE_CLASS,
    STATUS_LABELS,
    STATUS_HINTS,
    DetailBlock,
    CopyButton,
    parseRequestContext,
    LocalTime,
    formatRelativeTime,
    formatLocalTimestamp,
} from "../error_ui";

export default function ErrorDetailView({ row }: { row: ErrorRow }): Component {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    // See errors_list_client.tsx's identical listener — a bfcache restore
    // (e.g. hitting Back after leaving this page) replays stale React state
    // instead of hitting the network, regardless of Cache-Control headers.
    useEffect(() => {
        function handlePageShow(event: PageTransitionEvent): void {
            if (event.persisted) router.refresh();
        }
        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, [router]);

    async function handleStatusChange(status: ErrorStatus): Promise<void> {
        setIsPending(true);
        try {
            await setErrorStatus([row.id], status);
            router.refresh();
        } finally {
            setIsPending(false);
        }
    }

    async function handleDelete(): Promise<void> {
        if (!window.confirm("Delete this error? This can't be undone.")) return;
        setIsPending(true);
        try {
            await deleteErrors([row.id]);
            router.push("/errors");
        } finally {
            setIsPending(false);
        }
    }

    const requestContext = parseRequestContext(row.params);

    return (
        <div className="flex flex-col gap-5" style={{ opacity: isPending ? 0.5 : 1 }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${STATUS_BADGE_CLASS[row.status]}`}>
                            {row.status}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {row.flavour}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {row.is_client === 1 ? "Client" : "Server"}
                        </span>
                        {row.count > 1 && (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                Seen ×{row.count}
                            </span>
                        )}
                        <CopyButton
                            text={typeof window !== "undefined" ? window.location.href : `/errors/${row.id}`}
                            label="Copy link"
                            copiedLabel="Link copied"
                        />
                    </div>
                    <h1 className="font-mono text-lg font-semibold wrap-break-word text-gray-900 dark:text-white">{row.caller}</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{row.message}</p>
                </div>
                <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:items-end">
                  <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
                    <div className="flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                        {(Object.keys(STATUS_LABELS) as ErrorStatus[]).map((status, index) => (
                            <button
                                key={status}
                                disabled={isPending || row.status === status}
                                onClick={() => handleStatusChange(status)}
                                className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-default sm:flex-none ${
                                    index > 0 ? "border-l border-gray-300 dark:border-gray-700" : ""
                                } ${
                                    row.status === status
                                        ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                                        : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                                }`}
                            >
                                {STATUS_LABELS[status]}
                            </button>
                        ))}
                    </div>
                    <button
                        disabled={isPending}
                        onClick={handleDelete}
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                    >
                        Delete error
                    </button>
                  </div>
                  <p className="max-w-72 text-[11px] leading-snug text-gray-400 sm:text-right dark:text-gray-500">
                      {STATUS_HINTS[row.status]}
                  </p>
                </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs sm:grid-cols-3 dark:border-gray-800 dark:bg-gray-900/60">
                <div>
                    <dt className="text-gray-400 dark:text-gray-500">First seen</dt>
                    <dd className="text-gray-700 dark:text-gray-300"><LocalTime format={formatLocalTimestamp} timestampMs={row.created_at} /></dd>
                </div>
                <div>
                    <dt className="text-gray-400 dark:text-gray-500">Last seen</dt>
                    <dd className="text-gray-700 dark:text-gray-300">
                        <LocalTime format={formatLocalTimestamp} timestampMs={row.updated_at} />{" "}
                        <span className="text-gray-400 dark:text-gray-500">(<LocalTime format={formatRelativeTime} timestampMs={row.updated_at} />)</span>
                    </dd>
                </div>
                <div>
                    <dt className="text-gray-400 dark:text-gray-500">User</dt>
                    <dd className="text-gray-700 dark:text-gray-300">{row.user_email ?? "Unknown / not signed in"}</dd>
                </div>
                <div>
                    <dt className="text-gray-400 dark:text-gray-500">Regressions</dt>
                    <dd className="text-gray-700 dark:text-gray-300">
                        {row.reopen_count > 0
                            ? `Came back ${row.reopen_count} time${row.reopen_count === 1 ? "" : "s"} after being resolved`
                            : "Never came back after a fix"}
                    </dd>
                </div>
                {row.resolved_at !== null && (
                    <div>
                        <dt className="text-gray-400 dark:text-gray-500">Resolved</dt>
                        <dd className="text-gray-700 dark:text-gray-300"><LocalTime format={formatRelativeTime} timestampMs={row.resolved_at} /></dd>
                    </div>
                )}
                {requestContext?.path && (
                    <div>
                        <dt className="text-gray-400 dark:text-gray-500">Page</dt>
                        <dd className="break-all text-gray-700 dark:text-gray-300">{requestContext.path}</dd>
                    </div>
                )}
                {requestContext?.referer && (
                    <div>
                        <dt className="text-gray-400 dark:text-gray-500">Referrer</dt>
                        <dd className="break-all text-gray-700 dark:text-gray-300">{requestContext.referer}</dd>
                    </div>
                )}
                {requestContext?.userAgent && (
                    <div className="col-span-2 sm:col-span-3">
                        <dt className="text-gray-400 dark:text-gray-500">User agent</dt>
                        <dd className="break-all text-gray-700 dark:text-gray-300">{requestContext.userAgent}</dd>
                    </div>
                )}
            </dl>

            <DetailBlock label="Message" text={row.message} />
            {row.stack && <DetailBlock label="Stack trace" text={row.stack} />}
            {row.params && <DetailBlock label="Params" text={row.params} />}
        </div>
    );
}
