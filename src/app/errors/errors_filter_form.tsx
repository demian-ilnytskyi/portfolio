"use client";

import { useRef, useState } from "react";

const FIELD_CLASS =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white";

export default function ErrorsFilterForm({
    flavours,
    filters,
}: {
    flavours: string[];
    filters: { flavour: string; status: string; q: string };
}): Component {
    const [flavour, setFlavour] = useState(filters.flavour);
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <form
            ref={formRef}
            className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900/60"
        >
            {/* Status is controlled by ErrorsStatStrip above — preserve
                whatever it's currently set to so submitting this form
                (flavour/search) doesn't silently reset it back to "all". */}
            <input type="hidden" name="status" value={filters.status} />
            <label className="flex flex-col gap-1">
                <span id="errors-flavour-label" className="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Flavour</span>
                <select
                    aria-labelledby="errors-flavour-label"
                    name="flavour"
                    value={flavour}
                    onChange={(event) => {
                        setFlavour(event.target.value);
                        formRef.current?.requestSubmit();
                    }}
                    className={FIELD_CLASS}
                >
                    <option value="all">All flavours</option>
                    {flavours.map((flavour) => (
                        <option key={flavour} value={flavour}>
                            {flavour}
                        </option>
                    ))}
                </select>
            </label>
            <label className="flex min-w-48 flex-1 flex-col gap-1">
                <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Search</span>
                <input
                    type="text"
                    name="q"
                    placeholder="Message, caller, or user email"
                    defaultValue={filters.q}
                    className={FIELD_CLASS}
                />
            </label>
            <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
                Apply
            </button>
        </form>
    );
}
