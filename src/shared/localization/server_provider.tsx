import LocationzationClientProvider from "./client_provider";
import { getLocale, loadMessagesForLocale, type TranslationObject } from "./server";

export default async function LocationzationProvider({ locale, messages, children }: { locale?: Language, messages?: TranslationObject, children: React.ReactNode }): Promise<Component> {
    const language = locale ?? await getLocale();
    const messagesValue = messages ?? await loadMessagesForLocale(language);

    return <LocationzationClientProvider locale={language} messages={messagesValue}>
        {children}
    </LocationzationClientProvider>
}