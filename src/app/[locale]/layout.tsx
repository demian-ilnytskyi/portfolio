import type { Metadata } from "next";
import NavigationBar from "@/shared/components/nav_bar/nav_bar";
import metadataHelper, { openGraph } from "@/shared/helpers/metadata_helper";
import Footer from "@/shared/components/footer";
import { PersonScheme } from "@/shared/components/shems";
import { DetectThemeScript, getCurrentTheme, getTranslations, IntlProvider, cn } from "optimized-next-intl";


export async function generateMetadata({ params }: {
  params: Promise<{ locale: Language }>;
}): Promise<Metadata> {
  const { locale } = await params;
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
  const { locale, isDark, htmlParam } = await getCurrentTheme();

  return <html {...htmlParam} >
    <head>
      <meta httpEquiv="Content-Language" content={locale} />
      <DetectThemeScript isDark={isDark} />
      <PersonScheme />
    </head>
    <body
      className={cn(`bg-white dark:bg-gray-900`)}>
      <IntlProvider language={locale} >
        <div className="flex flex-col min-h-screen mx-4 lg:mx-24 tablet:mx-8 self-center">
          <NavigationBar isDark={isDark ?? undefined} />
          {children}
          <Footer />
        </div>
      </IntlProvider>
    </body>
  </html >;
}
