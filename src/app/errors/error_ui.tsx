"use client";

import { useEffect, useState } from "react";
import type { ErrorStatus } from "@/shared/repositories/errors_repository";
import { formatLocalDateTime, utcMillisToBrowserLocalIso } from "@/shared/utils/datetime";

/** `timestampMs` is a UTC epoch-ms value (see errors_repository.ts's `Date.now()` writes) — converted to the browser's own zone. */
export function formatLocalTimestamp(timestampMs: number): string {
    return formatLocalDateTime(utcMillisToBrowserLocalIso(timestampMs));
}

/** These pages are `force-dynamic`, so they SSR on every request: on Workers the
 * server zone is UTC while the browser zone is the viewer's. Reading the browser
 * zone during render would mismatch on hydration, so defer it until after mount. */
export function useMounted(): boolean {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted;
}

/** Renders a browser-zone-dependent time string, blank until hydrated. */
export function LocalTime({ format, timestampMs }: {
    format: (timestampMs: number) => string;
    timestampMs: number;
}): Component {
    const mounted = useMounted();
    return <span suppressHydrationWarning>{mounted ? format(timestampMs) : ""}</span>;
}

export const STATUS_LABELS: Record<ErrorStatus, string> = {
    new: "New",
    investigating: "Investigating",
    resolved: "Resolved",
    muted: "Muted",
};

/** One-line explanation of what each status DOES when the error fires again. */
export const STATUS_HINTS: Record<ErrorStatus, string> = {
    new: "Needs triage.",
    investigating: "Being worked on. Repeats keep this status.",
    resolved: "Fixed. If it happens again it reopens as New.",
    muted: "Ignored for good. Repeats stay hidden and never change status.",
};

export const STATUS_DOT_CLASS: Record<ErrorStatus, string> = {
    new: "bg-red-500",
    investigating: "bg-amber-500",
    resolved: "bg-emerald-500",
    muted: "bg-gray-400 dark:bg-gray-500",
};

export const STATUS_BADGE_CLASS: Record<ErrorStatus, string> = {
    new: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30",
    investigating:
        "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30",
    resolved:
        "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30",
    muted:
        "bg-gray-100 text-gray-500 ring-1 ring-inset ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700",
};

export function formatRelativeTime(timestampMs: number): string {
    const diffSeconds = Math.round((timestampMs - Date.now()) / 1000);
    const absSeconds = Math.abs(diffSeconds);

    const units: [Intl.RelativeTimeFormatUnit, number][] = [
        ["year", 31536000],
        ["month", 2592000],
        ["week", 604800],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
    ];

    for (const [unit, secondsInUnit] of units) {
        if (absSeconds >= secondsInUnit) {
            const value = Math.round(diffSeconds / secondsInUnit);
            return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(value, unit);
        }
    }
    return "just now";
}

export function CopyButton({
    text,
    label = "Copy",
    copiedLabel = "Copied",
}: {
    text: string;
    label?: string;
    copiedLabel?: string;
}): Component {
    const [copied, setCopied] = useState(false);

    function handleCopy(event: React.MouseEvent): void {
        event.preventDefault();
        void navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="rounded-md border border-gray-300 px-2 py-1 text-[11px] font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        >
            {copied ? copiedLabel : label}
        </button>
    );
}

export function DetailBlock({ label, text }: { label: string; text: string }): Component {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-gray-800 dark:bg-gray-950/60">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</span>
                <CopyButton text={text} />
            </div>
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words p-3 font-mono text-xs leading-relaxed text-gray-700 dark:bg-gray-950 dark:text-gray-300">
                {text}
            </pre>
        </div>
    );
}

export interface ParsedRequestContext {
    path?: string;
    userAgent?: string;
    referer?: string;
}

/** `params` is the raw JSON stored on the row — `createServerErrorAction`
 * (cloudflare-next-intl) nests request context under `requestContext` for
 * every client-originated error; server errors won't have it. */
export function parseRequestContext(paramsJson: string | null): ParsedRequestContext | null {
    if (!paramsJson) return null;
    try {
        const parsed = JSON.parse(paramsJson) as { requestContext?: ParsedRequestContext };
        return parsed.requestContext ?? null;
    } catch {
        return null;
    }
}
