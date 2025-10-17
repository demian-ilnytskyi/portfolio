import Secrets from "../constants/variables/secrets";
import KTextConstants from "../constants/variables/text_constants";
import cloudflareRepository from "./cloudflare_repository";

export interface ErrorParams {
    error: unknown;
    params?: Record<string, unknown>;
    classOrMethodName: string;
    optionalParams?: unknown[];
    isClient?: boolean;
}

/**
 * Handles formatting and sending error reports to a Telegram chat.
 * It includes features to prevent spamming by deduplicating recent identical errors
 * and rate-limiting the number of reports sent per instance.
 */
export class ErrorRepository {
    private static readonly MAX_TELEGRAM_MESSAGE_LENGTH = 4000;
    private static readonly MAX_ERROR_REPORTS_PER_INSTANCE = 3;
    private static readonly MAX_FUNCTION_RESOLUTION_ATTEMPTS = 5;
    private static readonly TELEGRAM_API_BASE_URL = `https://api.telegram.org/bot${Secrets.telegramBotToken}`;

    private lastMessageText: string | null = null;
    private errorCount = 0;

    // --- Global Error Handler Override ---
    private static readonly IGNORED_CONSOLE_ERRORS = [
        'The `punycode` module is deprecated. Please use a userland alternative instead.',
        'failed to pipe response',
    ];

    /**
     * Resets the rate-limiting and deduplication state.
     * Call this at the beginning of a new request or operation.
     */
    public init(): void {
        this.lastMessageText = null;
        this.errorCount = 0;
    }

    /**
     * Formats and sends an error report if conditions are met.
     * @param params - The error details to report.
     */
    public sendErrorReport({ error, ...params }: ErrorParams): void {
        // --- Guard Clauses: Exit early if we shouldn't send a report ---
        if (!error) {
            return;
        }
        if (this.errorCount >= ErrorRepository.MAX_ERROR_REPORTS_PER_INSTANCE) {
            console.warn("Error report limit reached. Suppressing further reports.");
            return;
        }

        try {
            const text = this._buildMessageText({ error, ...params });

            // In development, just log the formatted error to the console.
            if (KTextConstants.isDev) {
                console.warn("DEV MODE: Error report would be:", text);
                return;
            }

            // --- Deduplication and Sending Logic ---
            if (text && this.lastMessageText !== text) {
                this.lastMessageText = text;
                this.errorCount++;
                this._sendToTelegram(text);
            }
        } catch (formattingError) {
            console.warn(`An internal error occurred while formatting the error report: ${formattingError}`);
        }
    }

    /**
     * Constructs the full, formatted message text for the Telegram report.
     */
    private _buildMessageText({ error, classOrMethodName, params, optionalParams, isClient }: ErrorParams): string | null {
        const errorText = this._stringifyUnknown(error, isClient);
        const optionalParamsText = this._formatDetailsBlock("Optional Params", optionalParams, isClient);
        if (ErrorRepository.IGNORED_CONSOLE_ERRORS.some(
            ignored => errorText.includes(ignored) || (optionalParams?.includes(ignored) ?? false)
        )) {
            return null;
        }
        const paramsText = this._formatDetailsBlock("Params", params, isClient);
        const flavourText = KTextConstants.flavour ? `🍦 *Flavour:* ${KTextConstants.flavour}` : "";

        const messageParts = [
            `🚨 *InflaLite Error Report*`,
            `🕒 *Time:* ${new Date().toLocaleString("uk-UA")}`,
            `🌐 *Environment:* ${process.env.NODE_ENV ?? "unknown"}`,
            flavourText,
            classOrMethodName ? `🏷 *Location:* ${classOrMethodName}` : "",
            `------------------------------`,
            `❌ *Error:*`,
            `\`\`\`ts\n${errorText}\n\`\`\``,
            paramsText,
            optionalParamsText,
        ];

        const fullText = messageParts.filter(Boolean).join("\n");
        return this._truncateText(fullText, ErrorRepository.MAX_TELEGRAM_MESSAGE_LENGTH);
    }

    /**
     * Formats an object or array into a pretty-printed JSON block for the report.
     */
    private _formatDetailsBlock(title: string, data: unknown, isClient?: boolean): string {
        if (!data || (Array.isArray(data) && data.length === 0) || (typeof data === 'object' && Object.keys(data).length === 0)) {
            return "";
        }

        let content: string;
        if (Array.isArray(data)) {
            content = data.map(v => this._stringifyUnknown(v, isClient)).join(',\n');
        } else {
            content = JSON.stringify(
                Object.fromEntries(
                    Object.entries(data as Record<string, unknown>).map(([key, value]) => [
                        key,
                        // Attempt to stringify the value, but fallback to a simple string representation
                        // to avoid crashing on circular references within nested objects.
                        this._stringifyUnknown(value, isClient, true),
                    ])
                ),
                null,
                2
            );
        }

        return `\n📦 *${title}:*\n\`\`\`json\n${content}\n\`\`\``;
    }

    /**
     * Safely converts an `unknown` value into a string for logging.
     * @param value - The value to stringify.
     * @param isClient - Flag to avoid executing functions on client-side errors.
     * @param isNested - If true, fallback to a simple string to prevent circular reference errors.
     */
    private _stringifyUnknown(value: unknown, isClient?: boolean, isNested = false): string {
        if (typeof value === "string") return value;
        if (value instanceof Error) return `${value.name}: ${value.message}\n\n${value.stack ?? ""}`;

        if (!isClient && typeof value === 'function') {
            const resolvedValue = this.resolveFunctionError(value);
            // Avoid infinite recursion if the function returns itself or another function
            return typeof resolvedValue !== 'function' ? this._stringifyUnknown(resolvedValue, isClient) : '[Function]';
        }

        // For nested objects, a simpler stringify prevents crashes on circular refs
        if (isNested) {
            try {
                return JSON.stringify(value);
            } catch {
                return '[Unserializable Object]';
            }
        }

        return JSON.stringify(value, null, 2);
    }

    /**
     * Attempts to resolve an error that is wrapped in a function.
     * This is useful for lazily-evaluated error messages.
     * @param func - The function to resolve.
     */
    resolveFunctionError(value: unknown): unknown {
        let result = value;
        try {
            for (let i = 0; i < ErrorRepository.MAX_FUNCTION_RESOLUTION_ATTEMPTS && typeof result === 'function'; i++) {
                result = result();
            }
            return result;
        } catch (e) {
            return `Error during function resolution: ${e}`;
        }
    }

    /**
     * Truncates text to a maximum length, appending '...'.
     */
    private _truncateText(text: string, maxLength: number): string {
        return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
    }

    /**
     * Sends the formatted message to the Telegram API without blocking the main thread.
     */
    private _sendToTelegram(text: string): void {
        const payload = {
            chat_id: Secrets.telegramChatId,
            text: text,
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
        };

        cloudflareRepository.waitUntil({
            callback: async () => {
                const response = await fetch(`${ErrorRepository.TELEGRAM_API_BASE_URL}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.warn(`Failed to send Telegram error report: ${response.status} ${errorText}`);
                }
            },
            errorCallback: (error) => console.warn(`Network error while sending Telegram report: ${error}`),
        });
    }
}

// --- Singleton Instance ---
const errorRepository = new ErrorRepository();
export default errorRepository;

// Override console.error to automatically capture and report errors.
// This is a powerful pattern for comprehensive error logging.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.error = (message?: any, ...optionalParams: any[]) => {
    errorRepository.sendErrorReport({
        classOrMethodName: 'Global Console Error Handler',
        error: message,
        optionalParams
    });
};