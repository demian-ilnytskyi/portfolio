'use client'

import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import TryAgainButton from "./try_again_button"
import { cn } from "@/lib/utils";
import errorPageTranslation from "./translations";
import KIcons from "@/shared/constants/components/icons";

export default function GlobalErrorBody({ locale }: { locale: Language }): Component {

    const t = errorPageTranslation.getLocale(locale);

    return <main
        className="flex-1 flex flex-col items-center justify-center min-h-screen mx-4 justify-self-center">
        <KIcons.error width={100} height={100} className="mb-5" color="#de3730" />
        <h1
            className={cn(AppTextStyle.h1, 'font-bold text-ref-error-error-50 mb-4')}
        >
            {t['title']}
        </h1>
        <h2 className={cn(AppTextStyle.titleLarge, 'mb-4')}>
            {t['subtitle']}
        </h2>
        <TryAgainButton buttonText={t['tryAgain']} />
        <p className="mt-4 text-sm text-gray-600">{t['info']}</p>
    </main>;
}