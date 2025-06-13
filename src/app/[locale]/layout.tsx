import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { setPageLocaleAsync } from '@/shared/constants/variables/locale_helper';
import AnalyticsInitScript from "@/shared/components/analytics_init_script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import NavigationBar from "@/shared/components/nav_bar/nav_bar";
import CookieHook from "@/shared/components/cookie/cookie_hook";
import { cn } from "@/lib/utils";
import metadataHelper, { openGraph } from "@/shared/helpers/metadata_helper";


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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Language }>;
}>): Promise<Component> {
  const locale = await setPageLocaleAsync(params);
  // const nonce = (await headers()).get('x-nonce') ?? undefined;
  return <html lang={locale} >
    <head>
      <meta httpEquiv="Content-Language" content={locale} />
      <AnalyticsInitScript />
      {/* Google tag */}
      {process.env.NODE_ENV !== "development"
        && <GoogleAnalytics
          gaId="G-5K1QYSG097"
        // nonce={nonce} 
        />}
    </head>
    <body
      className={cn(`text-secondary bg-white`)}>
      <NextIntlClientProvider locale={locale}  >
        <CookieHook />
        <div className="flex flex-col min-h-screen mx-4 desk:mx-24 tablet:mx-8 self-center">
          <NavigationBar />
          {children}

        </div>
      </NextIntlClientProvider>
    </body>
  </html >;
}
