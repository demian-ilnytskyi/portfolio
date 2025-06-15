import type { Metadata } from "next";
import PrivacyPolicyContent from "./components/content";
import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import { cn } from "@/lib/utils";
// import { getTranslations } from "next-intl/server";
import metadataHelper from "@/shared/helpers/metadata_helper";
import AppLinks from "@/shared/constants/variables/links";
import { getTranslations } from "@/shared/localization/server";

export async function generateMetadata({ params }: {
    params: Promise<{ locale: Language }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations('Metadata.PrivacyPolicy', locale);
    return metadataHelper({
        t: t,
        linkPart: AppLinks.privacyPolicyLink,
        locale: locale,
    });
};

export default async function PrivacyPolicyPage({ params }: {
    params: Promise<{ locale: Language }>;
}): Promise<Component> {
    const { locale } = await params;

    const t = await getTranslations('PrivacyPolicyPage');

    return <main
        className={cn(
            "flex-1 flex flex-col w-full max-w-4xl",
            "mx-auto mt-10 shadow-md rounded-xl p-8 bg-neutral",
            "shadow-sys-light-surface-dim shadow-xl",
        )}>
        <h1 className={cn(AppTextStyle.h1TabletBold, "mb-6 text-center not-tablet:text-3xl")}>
            {t('title')}
        </h1>
        <div className={cn("prose prose-lg max-w-none", AppTextStyle.titleMedium)}>
            <PrivacyPolicyContent locale={locale} />
        </div>
    </main>
}