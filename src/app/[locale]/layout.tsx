import type { Metadata } from "next";
import NavigationBar from "@/shared/components/nav_bar/nav_bar";
import metadataHelper from "@/shared/helpers/metadata_helper";
import Footer from "@/shared/components/footer";
import { PersonScheme } from "@/shared/components/shems";
import {
  getLayoutStates,
  getMessage,
  getTranslations,
  IntlHelperScript,
  IntlProvider
} from "optimized-next-intl";
import ClientCnsoleErrorRewrite from "@/shared/components/client_console_error_rewrite";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: Language }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('Metadata.Main', locale);

  return {
    ...metadataHelper({
      isMain: true,
      t: t,
      linkPart: '/',
      locale: locale,
    }),
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
  const { locale, isDark, htmlParam } = await getLayoutStates();
  const messages = await getMessage(locale);

  return <html {...htmlParam}>
    <head>
      <meta httpEquiv="Content-Language" content={locale} />
      <PersonScheme />
      <IntlHelperScript isDark={isDark} />
    </head>
    <body className="bg-white dark:bg-gray-900 text-black dark:text-white ease-out">
      <IntlProvider language={locale} messages={messages} >
        <div className="flex flex-col min-h-screen mx-4 lg:mx-24 tablet:mx-8 self-center">
          <NavigationBar isDark={isDark ?? undefined} />
          {children}
          <Footer />
        </div>
      </IntlProvider>
      <ClientCnsoleErrorRewrite />
    </body>
  </ html>;
}
