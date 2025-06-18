import { cn } from "@/lib/utils";
import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import ContactForm from "./contact_form";
import { getTranslations } from "@/shared/localization/server";

export default async function ContactFormContent(): Promise<Component> {
    const t = await getTranslations('HomePage.ContactForm');

    return <section className="items-center flex flex-col p-4 md:p-8 max-w-3xl self-center">
        <h3 className={cn(
            AppTextStyle.headlineSmall,
            "not-md:text-3xl text-center mb-6"
        )}>
            {t('title')}
        </h3>
        <h4 className={cn(
            AppTextStyle.bodyLarge,
            "text-center mb-4 dark:text-gray-400 text-gray-500"
        )}>
            {t('description')}
        </h4>
        <ContactForm />
    </section>;
}