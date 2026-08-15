'use client'

import KTextConstants from '@/shared/constants/variables/text_constants';
import { usePathname } from 'next/navigation';
import GlobalErrorBody, { isChunkLoadError } from './global-error/body';
import { useEffect } from 'react';
import { reportClientError } from '@/shared/error_handling/report_client_error';

import "./globals.css";

export default function GlobalError({
    error,
}: {
    error: Error & { digest?: string }
}): Component {
    const path = usePathname();
    let locale: Language;

    useEffect(() => {
        if (isChunkLoadError(error)) return;
        reportClientError(error, 'GlobalError');
    }, [error])

    switch (path.split('/').filter(Boolean).at(0)) {
        case 'uk':
            locale = 'uk';
            break;
        default:
            locale = KTextConstants.defaultLocale;
    }

    return <html lang={locale}>
        <body className='flex justify-center h-screen bg-white dark:bg-gray-900 text-black dark:text-white'>
            <GlobalErrorBody locale={locale} error={error} />
        </body>
    </html>
}