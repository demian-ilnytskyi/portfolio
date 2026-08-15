import type { ErrorHandlingParams } from "cloudflare-next-intl/errorHandling";
// import telegramOnError from "./telegram_on_error";
import d1OnError from "./d1_on_error";

/**
 * Fans out every reported error to the active sinks independently — one
 * sink failing must not suppress the others. Telegram reporting is disabled
 * for now (the /errors dashboard is the sole sink) — see telegram_on_error.ts.
 */
export default async function onError(params: ErrorHandlingParams): Promise<void> {
    await Promise.allSettled([/* telegramOnError(params), */ d1OnError(params)]);
}
