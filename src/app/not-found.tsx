import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import type { Metadata } from "next";
import RootLayout from "./[locale]/layout";
import metadataHelper from "@/shared/helpers/metadata_helper";
import { getLocale, getTranslations, Link } from "optimized-next-intl";
import { cn } from "@/lib/utils";
import { useTranslations } from "optimized-next-intl/use";

// Generate this page dynamic because we get language from cookie
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale() as Language;
  const t = await getTranslations('NotFound.Metadata.General', locale);
  return {
    ...metadataHelper({
      t: t,
      linkPart: '',
      locale: locale,
    }),
    robots: {
      index: false,
      follow: false,
    },
  };
};

export default function NotFound(): Component {
  return <RootLayout>
    <PageContent />
  </RootLayout>;
}

function PageContent(): Component {
  const t = useTranslations('NotFound.General');
  return <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
    <h1 className={cn(AppTextStyle.h1Tablet, 'font-bold not-small-mobile:text-4xl')}>
      {t('title')}
    </h1>
    <h2 className={cn(AppTextStyle.bodyLarge, 'text-xl my-2')}>
      {t('description')}
    </h2>
    <div className={cn(
      AppTextStyle.bodyLarge,
      "flex flex-wrap gap-5 justify-center text-xl",
      "not-small-mobile:text-base"
    )}>
      <Link
        href="/"
        className={cn(
          'py-2 px-5 flex w-max justify-self-center mt-5',
          'rounded-4xl dark:hover:bg-gray-400 hover:bg-gray-500',
          "dark:bg-gray-300 dark:text-gray-700 bg-gray-600 text-gray-200",
        )} >
        {t('goToHomePage')}
      </Link>
    </div>
  </main>;
}
