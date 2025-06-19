"use server";

export interface ContactProps {
    isError?: boolean;
}

const telegramBotToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.NEXT_PUBLIC_TELEGRAM_SEND_CHAT_ID;

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
        const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

        // Send the HTTP request to Telegram Bot API
        const response = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: text,
                parse_mode: 'Markdown', // Use 'Markdown' for bolding text, or 'HTML' if you prefer HTML formatting
            }),
        });

        // Parse the JSON response from Telegram
        const data: { ok?: boolean; } = await response.json();

        // Check if the request was successful
        if (!response.ok || ('ok' in data && !data.ok)) {
            console.error('Error sending message:', response.body, data);
            return {
                isError: true,
            };
        }

        // Return success message
        return {
            isError: false,
        };
    } catch (error) {
        // Catch any unexpected errors during the process
        console.error('An unknown error occurred while sending the message:', error);
        return {
            isError: true,
        };
    }
}