import type { ErrorHandlingParams } from "cloudflare-next-intl/errorHandling";
import KTextConstants from "../constants/variables/text_constants";
import Secrets from "../constants/variables/secrets";

const MAX_TELEGRAM_MESSAGE_LENGTH = 4000;

function truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
}

/**
 * Sends error reports to the Telegram group. The message itself
 * (`params.formattedMessage`) is built by `reportError` — this only
 * truncates it to Telegram's message-length limit and sends it. Dev-mode
 * short-circuits to `console.warn` instead of sending. Dedup/throttling
 * and ignore-list filtering are handled by
 * `reportError`/`installConsoleErrorOverride` itself (see
 * `errorHandling.dedup`/`throttleMs`/`ignoreConsoleErrors` in
 * `intl_config.ts`), not here. Pass as `RoutingConfig.errorHandling.onError`.
 */
export default async function telegramOnError(params: ErrorHandlingParams): Promise<void> {
    const text = truncateText(params.formattedMessage ?? '', MAX_TELEGRAM_MESSAGE_LENGTH);

    if (KTextConstants.isDev) {
        console.warn("DEV MODE: Error report would be:", text);
        return;
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${Secrets.telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: Secrets.telegramChatId,
                text,
                disable_web_page_preview: true,
            }),
        });
        if (!response.ok) {
            console.warn(`Failed to send Telegram error report: ${response.status} ${await response.text()}`);
        }
    } catch (error) {
        console.warn(`Network error while sending Telegram report: ${error}`);
    }
}
