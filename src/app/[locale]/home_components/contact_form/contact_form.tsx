"use client";

import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import { sendContact, type ContactProps } from "@/shared/repositories/contact_repository";
import type { FormEvent } from "react";
import { useActionState } from "react";
import { cn } from "@/lib/utils";
import clientSendErrorReport from "@/shared/helpers/error_client_helper";

const initialState: ContactProps = {
    isError: undefined,
};

interface ContactFormProps {
    nameErrorText: string;
    emailErrorText: string;
    emailFormatErrorText: string;
    messageErrorText: string;
    errorMessage: string;
    successMessage: string;
    children: React.ReactNode;
}

export default function ContactForm(params: ContactFormProps): Component {
    const {
        children,
        emailErrorText,
        emailFormatErrorText,
        messageErrorText,
        nameErrorText,
        errorMessage,
        successMessage,
    } = params;
    const [state, formAction] = useActionState(sendContact, initialState);

    const validateField = (fieldName: string, value: string): string | null => {
        switch (fieldName) {
            case "name":
                return value?.trim() ? null : nameErrorText;
            case "email": {
                if (!value?.trim()) return emailErrorText;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) ? null : emailFormatErrorText;
            }
            case "message":
            default:
                return value?.trim() ? null : messageErrorText;
        }
    };

    function onInput(input: FormEvent<HTMLFormElement>) {
        const target = input.target as HTMLInputElement | HTMLTextAreaElement;
        if (!target.name) return;
        try {
            const message = validateField(target.name, target.value);
            return target.setCustomValidity(message ?? '');
        } catch (e) {
            clientSendErrorReport({
                error: e,
                classOrMethodName: 'ContactForm Component',
                params: { value: target.value, name: target.name }
            });
        }
    }

    return <>
        <form
            className="flex flex-col w-full"
            action={formAction}
            onInvalid={onInput}
            onInput={onInput}>
            {children}
        </form>
        {state.isError !== undefined && <p className={cn(
            "mt-4 text-center",
            AppTextStyle.headlineSmall,
            state.isError ? 'text-red-600' : 'text-green-600'
        )}>
            {state.isError ? errorMessage : successMessage}
        </p>}
    </>;
}