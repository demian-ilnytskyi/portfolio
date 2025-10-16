"use server";

import Secrets from "../constants/variables/secrets";
import errorRepository from "./error_repository";

export interface ContactProps {
    isError?: boolean;
}

export async function sendContact(
    _prevState: ContactProps,
    formData: FormData,
): Promise<ContactProps> {
    try {
        // Extract form data
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const message = formData.get('message') as string;

        // Format the message for Telegram
        const textArray = [
            `*🚀 New Portfolio Contact Form Message 🚀*\n`, // Added emojis for visual appeal
            `--------------------`, // A clear separator
            `*👤 Name:* ${name}`,
            `*📧 Email:* ${email}`,
            `*📝 Message:*`, // Separated the label for multiline messages
            `\`\`\`\n${message}\n\`\`\`` // Use a code block for the message to preserve formatting and make it stand out
        ];

        const text = textArray.join('\n');

        // Telegram Bot API URL for sending messages
        const telegramApiUrl = `https://api.telegram.org/bot${Secrets.telegramBotToken}/sendMessage`;

        // Send the HTTP request to Telegram Bot API
        const response = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: Secrets.telegramChatId,
                text: text,
                parse_mode: 'Markdown', // Use 'Markdown' for bolding text, or 'HTML' if you prefer HTML formatting
            }),
        });

        // Parse the JSON response from Telegram
        const data: { ok?: boolean; } = await response.json();

        // Check if the request was successful
        if (!response.ok || ('ok' in data && !data.ok)) {
            errorRepository.sendErrorReport({
                error: response.body,
                classOrMethodName: 'sendContact',
                params: { data }
            });
            return {
                isError: true,
            };
        }

        // Return success message
        return {
            isError: false,
        };
    } catch (error) {
        errorRepository.sendErrorReport({
            error,
            classOrMethodName: 'sendContact',
        });
        return {
            isError: true,
        };
    }
}