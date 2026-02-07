import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import ContactForm from "./contact_form";
import { cn } from "@/lib/utils";
import { getTranslations } from "cloudflare-next-intl";
import ContactFormFields from "./contanct_form_fields";
import { Suspense } from "react";
import LoadingIndicator from "@/shared/components/loading_indicator";

export default async function ContactFormContent(): Promise<Component> {
    const t = await getTranslations("HomePage.ContactForm");

    return (
        <section className="items-center flex flex-col p-4 md:p-8 max-w-3xl self-center">
            <h3
                className={cn(
                    AppTextStyle.headlineSmall,
                    "not-md:text-3xl text-center mb-6",
                )}
            >
                {t("title")}
            </h3>
            <h4
                className={cn(
                    AppTextStyle.bodyLarge,
                    "text-center mb-4 dark:text-gray-400 text-gray-500",
                )}
            >
                {t("description")}
            </h4>
            <Suspense fallback={<LoadingIndicator />}>
                <ContactForm
                    nameErrorText={t("nameError")}
                    emailErrorText={t("emailError")}
                    emailFormatErrorText={t("emailFormatError")}
                    messageErrorText={t("messageError")}
                    errorMessage={t("errorMessage")}
                    successMessage={t("successMessage")}
                >
                    <ContactFormFields
                        nameLabelText={t("nameLabel")}
                        namePlaceholderText={t("namePlaceholder")}
                        emailLabelText={t("emailLabel")}
                        emailPlaceholderText={t("emailPlaceholder")}
                        messageLabelText={t("messageLabel")}
                        messagePlaceholderText={t("messagePlaceholder")}
                        submitButtonText={t("submitButton")}
                        nameTooltipText={t("nameError")}
                        emailTooltipText={t("emailError")}
                        messageTooltipText={t("messageError")}
                    />
                </ContactForm>
            </Suspense>
        </section>
    );
}
