const DATE_TIME_FORMAT: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
};

/** Client-only: converts a UTC epoch-ms value (e.g. a D1 timestamp) to a local ISO string in the browser's own zone. */
export function utcMillisToBrowserLocalIso(utcMillis: number): string {
    return new Date(utcMillis).toISOString();
}

export function formatLocalDateTime(localIso: string): string {
    return new Intl.DateTimeFormat("en-US", DATE_TIME_FORMAT).format(new Date(localIso));
}
