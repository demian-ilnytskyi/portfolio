'use client'

import KTextConstants from '@/shared/constants/variables/text_constants';
import { usePathname } from 'next/navigation';
import GlobalErrorBody from './global-error/body';

import "./globals.css";
import { useEffect } from 'react';

export default function GlobalError({
    error,
}: {
    error: Error & { digest?: string }
    reset: () => void
}): Component {
    const path = usePathname();
    let locale: Language;

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    switch (path.split('/').filter(Boolean).at(0)) {
        case 'en':
            locale = 'en';
            break;
        default:
            locale = KTextConstants.defaultLocale;
    }

    return <html lang={locale}>
        <body className='flex justify-center'>
            <GlobalErrorBody locale={locale} />
        </body>
    </html>
}