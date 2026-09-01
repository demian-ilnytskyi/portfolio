"use client";

import { useRouter } from "next/navigation";
import ErrorDetailView from "cloudflare-next-intl/ErrorDetailView";
import type { ErrorRow, ErrorsActions } from "cloudflare-next-intl/errorsBoard";

// ErrorDetailView doesn't assume a route (its `onDeleted` prop leaves that
// to the consumer) — and a function prop can't cross the Server->Client
// boundary from an async Server Component, so this thin wrapper is where
// that callback (and the useRouter it needs) actually lives.
export default function ErrorDetailClient({
    row,
    actions,
}: {
    row: ErrorRow;
    actions: ErrorsActions;
}): Component {
    const router = useRouter();
    return <ErrorDetailView row={row} actions={actions} onDeleted={() => router.push("/errors")} />;
}
