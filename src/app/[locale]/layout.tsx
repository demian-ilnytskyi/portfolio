import type { Metadata } from "next";
import NavigationBar from "@/shared/components/nav_bar/nav_bar";
import metadataHelper from "@/shared/helpers/metadata_helper";
import Footer from "@/shared/components/footer";
import { PersonScheme } from "@/shared/components/shems";
import {
  getLocaleStaticParams,
  getMessage,
  getTranslations,
  IntlHelperScript,
  IntlProvider,
} from "cloudflare-next-intl";
import ClientCnsoleErrorRewrite from "@/shared/components/client_console_error_rewrite";
import CloudflareAnalyticsScript from "@/shared/components/cloudflare_analytics_script";
import KTextConstants from "@/shared/constants/variables/text_constants";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata | null> {
  if (KTextConstants.isBuild) return null;
  const { locale } = await params;
  const t = await getTranslations("Metadata.Main", locale);

  return {
    ...metadataHelper({
      isMain: true,
      t: t,
      linkPart: "/",
      locale: locale as Language,
    }),
    category: t("category"),
    manifest: `/${locale}/manifest.json`,
    other: {
      "Content-Language": locale,
    },
  };
}

export const generateStaticParams = getLocaleStaticParams;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>): Promise<Component | null> {
  if (KTextConstants.isBuild) return null;
  const result = await params;
  const locale = result?.locale ?? KTextConstants.defaultLocale;
  const messages = await getMessage(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Language" content={locale} />
        <PersonScheme />
        <IntlHelperScript />
        <CloudflareAnalyticsScript />
      </head>
      <body className="bg-white dark:bg-gray-900 text-black dark:text-white ease-out">
        <IntlProvider language={locale} messages={messages}>
          <div className="flex flex-col min-h-screen mx-4 lg:mx-24 tablet:mx-8 self-center">
            <NavigationBar />
            {children}
            <Footer />
          </div>
        </IntlProvider>
        <ClientCnsoleErrorRewrite />
      </body>
    </html>
  );
}
