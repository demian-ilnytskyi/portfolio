import type { Metadata } from "next";
import { setPageLocale, setPageLocaleAsync } from '@/shared/constants/variables/locale_helper';
import NavigationBar from "@/shared/components/nav_bar/nav_bar";
import { cn } from "@/lib/utils";
import metadataHelper, { openGraph } from "@/shared/helpers/metadata_helper";
import DeletectThemeScript from "@/shared/components/theme_switcher/deletect_theme_script";
import { cookies } from "next/headers";
import KTextConstants from "@/shared/constants/variables/text_constants";
import CookieKey, { getCookieBooleanValue } from "@/shared/constants/variables/cookie_key";
import { getTranslations } from "@/shared/localization/server";
import LocationzationProvider from "@/shared/localization/server_provider";


export async function generateMetadata({ params }: {
  params: Promise<{ locale: Language }>;
}): Promise<Metadata> {
  const locale = await setPageLocaleAsync(params);
  const t = await getTranslations('Metadata.Main', locale);

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
  const isDark = getCookieBooleanValue(isDarkMode);
  const locale = (cookie.get(CookieKey.localeCookieName)?.value as Language) ?? KTextConstants.defaultLocale;
  setPageLocale({ locale });
  const htmlClass = (isDark === true && { className: 'dark' });

  // const nonce = (await headers()).get('x-nonce') ?? undefined;
  return <html suppressHydrationWarning={!KTextConstants.isDev} lang={locale} {...htmlClass} >
    <head>
      <meta httpEquiv="Content-Language" content={locale} />
      {!isDarkMode && <DeletectThemeScript />}
    </head>
    <body
      className={cn(`bg-white dark:bg-gray-900`)}>
      <LocationzationProvider locale={locale} >
        <div className="flex flex-col min-h-screen mx-4 desk:mx-24 tablet:mx-8 self-center">
          <NavigationBar isDark={isDark ?? undefined} />
          {children}

        </div>
      </LocationzationProvider>
    </body>
  </html >;
}
