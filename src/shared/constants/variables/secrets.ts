export default abstract class Secrets {
    static readonly telegramBotToken = process.env.TELEGRAM_BOT_TOKEN!;
    static readonly telegramChatId = process.env.TELEGRAM_SEND_CHAT_ID!;
}