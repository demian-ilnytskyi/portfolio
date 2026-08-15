'use client'

import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import TryAgainButton from "./try_again_button"
import errorPageTranslation from "./translations";
import KIcons from "@/shared/constants/components/icons";
import { cn } from "@/lib/utils";
import KTextConstants from "@/shared/constants/variables/text_constants";
import { useEffect, useState } from "react";
import LoadingIndicator from "@/shared/components/loading_indicator";


export function isChunkLoadError(error: Error): boolean {
    const message = error.message?.toLowerCase() ?? '';
    return error.name === 'ChunkLoadError'
        || message.includes('chunk')
        || message.includes('failed to fetch')
        || message.includes('loading css chunk');
}

export default function GlobalErrorBody({ locale, error }: { locale: Language, error: Error }): Component {

    const t = errorPageTranslation.getLocale(locale);
    const isChunkError = isChunkLoadError(error);
    const [showLoading, setShowLoading] = useState(isChunkError);

    useEffect(() => {
        if (!isChunkError) return;
        const timeout = setTimeout(() => setShowLoading(false), 5000);
        return () => clearTimeout(timeout);
    }, [isChunkError]);

    if (showLoading) return <LoadingIndicator />;

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
        <p className="mt-4 text-base text-gray-400">
            {t['support']}{' '}
            <a href={`mailto:${KTextConstants.ownerEmail}`} className="text-gray-500 underline hover:text-black">
                {t['contactMe']}
            </a>
        </p>
        <p className="mt-4 text-sm text-gray-400">{t['info']}</p>
    </main>;
}
