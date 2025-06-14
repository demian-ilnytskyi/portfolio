import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { setPageLocale } from '@/shared/constants/variables/locale_helper';
import AnalyticsInitScript from "@/shared/components/analytics_init_script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import NavigationBar from "@/shared/components/nav_bar/nav_bar";
import { cn } from "@/lib/utils";
import metadataHelper, { openGraph } from "@/shared/helpers/metadata_helper";
import DeletectThemeScript from "@/shared/components/deletect_theme_script";
import { cookies } from "next/headers";
import KTextConstants from "@/shared/constants/variables/text_constants";
import CookieKey from "@/shared/constants/variables/cookie_key";


export async function generateMetadata({ params }: {
  params: Promise<{ locale: Language }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.Main' });

  return {
    ...metadataHelper({
      isMain: true,
      t: t,
      linkPart: '',
      locale: locale,
    }),
    openGraph: openGraph(locale),
    category: t('category'),
    manifest: `/${locale}/manifest.json`,
    other: {
      "Content-Language": locale,
    },
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<Component> {
  const cookie = await cookies();
  const isDarkMode = cookie.get(CookieKey.isDarkCookieKey)?.value;
  const locale = (cookie.get(CookieKey.localeCookieName)?.value as Language) ?? KTextConstants.defaultLocale;
  await setPageLocale({ locale });
  const htmlClass = (isDarkMode === 'true' && { className: 'dark' });

  // const nonce = (await headers()).get('x-nonce') ?? undefined;
  return <html lang={locale} {...htmlClass} >
    <head>
      <meta httpEquiv="Content-Language" content={locale} />
      <AnalyticsInitScript />
      {/* Google tag */}
      {process.env.NODE_ENV !== "development"
        && <GoogleAnalytics
          gaId=""
        // nonce={nonce} 
        />}
      {!isDarkMode && <DeletectThemeScript />}
    </head>
    <body
      className={cn(`bg-white dark:bg-gray-900`)}>
      {/* bg-gray-900 */}
      <NextIntlClientProvider locale={locale} >
        {/* <CookieHook /> */}
        <div className="flex flex-col min-h-screen mx-4 desk:mx-24 tablet:mx-8 self-center">
          <NavigationBar />
          {children}

        </div>
      </NextIntlClientProvider>
    </body>
  </html >;
}
