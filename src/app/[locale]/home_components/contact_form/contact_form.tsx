"use client";

import { cn } from "@/lib/utils";
import Field from "@/shared/components/field";
import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import { useTranslations } from "@/shared/localization/client_provider";
import { sendContact, type ContactProps } from "@/shared/repositories/contact_repository";
import type { FormEvent } from "react";
import { useActionState } from "react";

const initialState: ContactProps = {
    isError: undefined,
};

export default function ContactForm(): Component {
    const t = useTranslations('HomePage.ContactForm');
    const [state, formAction] = useActionState(sendContact, initialState);

    const validateField = (fieldName: string, value: string): string | null => {
        switch (fieldName) {
            case "name":
                return value.trim() ? null : t('nameError');
            case "email": {
                if (!value.trim()) return t('emailError');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) ? null : t('emailFormatError');
            }
            case "message":
            default:
                return value.trim() ? null : t('messageError');
        }
    };

    function onInput(input: FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const target = input.currentTarget;
        try {
            const message = validateField(target.name, target.value);
            return target.setCustomValidity(message ?? '');
        } catch (e) {
            console.error(`Feedback Validation field error, field: ${target.name}`, e)
        }
    }

    return <form className="flex flex-col w-full" action={formAction}>
        <div className="flex  flex-wrap gap-3 mb-5">
            <Field
                label={t('nameLabel')}
                name={"name"}
                placeholder={t('namePlaceholder')}
                required className="flex-1 min-w-60"
                onInput={onInput}
                onInvalid={onInput} />
            <Field
                label={t('emailLabel')}
                name={"email"}
                placeholder={t('emailPlaceholder')}
                required className="flex-1 min-w-60"
                onInput={onInput}
                onInvalid={onInput} />
        </div>
        <Field
            label={t('messageLabel')}
            name={"message"}
            placeholder={t('messagePlaceholder')}
            required isLong rows={4}
            onInput={onInput}
            onInvalid={onInput} />
        <button
            type="submit"
            className={cn(
                "mt-8 px-6 py-2 dark:bg-blue-950 dark:text-white rounded-xl dark:hover:bg-blue-900 transition-colors",
                "bg-blue-300 hover:bg-blue-200 text-gray-800",
                AppTextStyle.bodyLarge,
            )}>
            {t('submitButton')}
        </button>
        {state.isError !== undefined && <p className={cn(
            "mt-4 text-center",
            AppTextStyle.headlineSmall,
            state.isError ? 'text-red-600' : 'text-green-600'
        )}>
            {state.isError ? t('errorMessage') : t('successMessage')}
        </p>}
    </form>;
}