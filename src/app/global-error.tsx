'use client'

import KTextConstants from '@/shared/constants/variables/text_constants';
import { usePathname } from 'next/navigation';
import GlobalErrorBody from './global-error/body';
import { useEffect } from 'react';
import clientSendErrorReport, { initClientError } from '@/shared/helpers/error_client_helper';

import "./globals.css";

export default function GlobalError({
    error,
}: {
    error: Error & { digest?: string }
}): Component {
    const path = usePathname();
    let locale: Language;

    useEffect(() => {
        initClientError();
        clientSendErrorReport({ error, classOrMethodName: 'GlobalError' });
    }, [error])

    switch (path.split('/').filter(Boolean).at(0)) {
        case 'uk':
            locale = 'uk';
            break;
        default:
            locale = KTextConstants.defaultLocale;
    }

    return <html lang={locale}>
        <body className='flex justify-center bg-white'>
            <GlobalErrorBody locale={locale} />
        </body>
    </html>
}