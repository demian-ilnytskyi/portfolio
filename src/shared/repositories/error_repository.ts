"use server";

import Secrets from "../constants/variables/secrets";
import KTextConstants from "../constants/variables/text_constants";

const originalConsoleError = console.error;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.error = (message?: any, ...optionalParams: any[]) => {
    sendErrorReport({
        classOrMethodName: 'Console Error Handler',
        error: message,
        optionalParams
    });
};

interface ErrorParams {
    error: unknown;
    params?: Record<string, unknown>;
    classOrMethodName: string;
    optionalParams?: unknown[];
}

const MAX_TELEGRAM_MESSAGE_LENGTH = 4000;

function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
}

export async function sendErrorReport({
    error,
    classOrMethodName,
    params,
    optionalParams,
}: ErrorParams): Promise<void> {
    if (!error) {
        return;
    }
    try {
        // Telegram Bot API URL for sending messages
        const telegramApiUrl = `https://api.telegram.org/bot${Secrets.telegramBotToken}/sendMessage`;

        let errorText: string;

        if (typeof error === "string") {
            errorText = error;
        } else if (error instanceof Error) {
            errorText = `${error.name}: ${error.message}\n\n${error.stack ?? ""}`;
        } else {
            errorText = JSON.stringify(error, null, 2);
        }

        // Prepare params output if provided
        const paramsText = params && Object.keys(params).length > 0
            ? `\n📦 *Params:*\n\`\`\`json\n${JSON.stringify(params, null, 2)}\n\`\`\``
            : "";

        // Prepare optionalParams output if provided
        const optionalParamsText = optionalParams && optionalParams.length > 0
            ? `\n🧩 *Optional Params:*\n\`\`\`json\n${JSON.stringify(optionalParams, null, 2)}\n\`\`\``
            : "";

        let text = [
            `🚨 *InflaLite Error Report*`,
            `🕒 *Time:* ${new Date().toLocaleString("uk-UA")}`,
            `🌐 *Environment:* ${process.env.NODE_ENV ?? "unknown"}`,
            classOrMethodName ? `🏷 *Location:* ${classOrMethodName}` : "",
            `------------------------------`,
            `❌ *Error:*`,
            `\`\`\`ts\n${errorText}\n\`\`\``,
            paramsText,
            optionalParamsText,
        ]
            .filter(Boolean)
            .join("\n");

        text = truncateText(text, MAX_TELEGRAM_MESSAGE_LENGTH);

        originalConsoleError(text);

        if (!KTextConstants.isDev)
            // Send the HTTP request to Telegram Bot API
            await fetch(telegramApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: Secrets.telegramChatId,
                    text: text,
                    parse_mode: 'Markdown', // Use 'Markdown' for bolding text, or 'HTML' if you prefer HTML formatting
                    disable_web_page_preview: true,
                }),
            });
    } catch (error) {
        // Catch any unexpected errors during the process
        console.error('An unknown error occurred while sending the error:', error);
    }
}