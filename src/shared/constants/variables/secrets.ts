export default abstract class Secrets {
    static readonly telegramBotToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN!;
    static readonly telegramChatId = process.env.NEXT_PUBLIC_TELEGRAM_SEND_CHAT_ID!;
}