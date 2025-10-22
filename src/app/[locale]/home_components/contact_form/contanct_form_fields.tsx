"use client";

import Field from "@/shared/components/field/field";
import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import { cn } from "@/lib/utils";

interface ContactFormContentProps {
    nameLabelText: string;
    namePlaceholderText: string;
    emailLabelText: string;
    emailPlaceholderText: string;
    messageLabelText: string;
    messagePlaceholderText: string;
    submitButtonText: string;
    nameTooltipText: string;
    emailTooltipText: string;
    messageTooltipText: string;
}

export default function ContactFormFields(params: ContactFormContentProps): Component {
    const {
        emailLabelText,
        emailPlaceholderText,
        messageLabelText,
        messagePlaceholderText,
        nameLabelText,
        namePlaceholderText,
        submitButtonText,
        emailTooltipText,
        messageTooltipText,
        nameTooltipText,
    } = params;

    return <>
        <div className="flex  flex-wrap gap-3 mb-5">
            <Field
                label={nameLabelText}
                tooltipText={nameTooltipText}
                type="name"
                name="name"
                placeholder={namePlaceholderText}
                required className="flex-1 min-w-60" />
            <Field
                label={emailLabelText}
                tooltipText={emailTooltipText}
                type="email"
                name="email"
                placeholder={emailPlaceholderText}
                required className="flex-1 min-w-60" />
        </div>
        <Field
            label={messageLabelText}
            tooltipText={messageTooltipText}
            name="message"
            placeholder={messagePlaceholderText}
            required isLong rows={4} autoComplete={false} />
        <button
            type="submit"
            className={cn(
                "mt-8 px-6 py-2 dark:bg-blue-950 dark:text-white rounded-xl dark:hover:bg-blue-900 transition-colors",
                "bg-blue-300 hover:bg-blue-200 text-gray-800",
                AppTextStyle.bodyLarge,
            )}>
            {submitButtonText}
        </button>
    </>;
}