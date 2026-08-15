import { IntlHelperScript } from "cloudflare-next-intl";


export default async function ErrorsLayout({ children }: { children: React.ReactNode }): Promise<React.ReactNode> {
    // /errors sits outside [locale]/layout.tsx, so it doesn't get
    // IntlHelperScript's theme sync. Reading the same cookie here and
    // setting the class server-side (rather than via a client script)
    // means it's correct on every request — including a soft client
    // navigation between /errors and /errors/[id], which wouldn't re-run a
    // one-shot client script mounted higher in a layout that persists
    // across that navigation.

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <IntlHelperScript />
            </head>
            <body className="bg-white text-black dark:bg-gray-900 dark:text-white">{children}</body>
        </html>
    );
}
