"use client";

import { cn } from "@/lib/utils";
import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import closeDialog from "./cookie_dialog_close_function";

export default function CookieDialogButtons({ acceptNecessaryText, acceptText }: {
    acceptNecessaryText: string;
    acceptText: string;
}): Component {
    return <>
        <button
            type="button"
            onClick={() => closeDialog(false)}
            className={cn(
                AppTextStyle.bodyMedium,
                "border-none outline-none px-2 sm:px-5 py-1 sm:py-2 bg-transparent text-neutral-500",
                "hover:bg-ref-error-error-60 whitespace-nowrap hover:text-neutral text-xs sm:text-sm"
            )}>
            {acceptNecessaryText}
        </button>

        <button
            type="button"
            onClick={() => closeDialog(true)}
            className={cn(
                AppTextStyle.titleMedium,
                "cursor-pointer border-none outline-none px-2 sm:px-5 py-1 sm:py-2 bg-neutral",
                "text-secondary font-bold hover:bg-primary not-sm:text-sm"
            )}>
            {acceptText}
        </button>
    </>
}