import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import Image from 'next/image';
import profileImage from "../../../../public/images/profile.png"
import { cn } from "@/lib/utils";
import { HomeImageScheme } from "@/shared/components/shems";
import { getTranslations } from "optimized-next-intl";

export default async function HomeImagePart(): Promise<Component> {
    const t = await getTranslations('HomePage.ImagePart');
    const title = t('title');
    return <section className="items-center flex flex-col mt-10 min-h-[77vh]">
        {/* Image Scheme For SEO Bots */}
        <HomeImageScheme title={title} />

        <Image
            src={profileImage}
            alt={'Profile'}
            loading={'eager'}
            placeholder="blur"
            priority
            width={400}
            height={400}
            fetchPriority="high"
            className="rounded-full border-gray-200 dark:border-0 border-2" />
        <h1 className={cn(AppTextStyle.h1, 'text-center tablet:text-6xl text-4xl mt-5')}>
            {title}
        </h1>
        <h2 className={cn(AppTextStyle.titleLarge, 'text-center mt-3 tablet:text-2xl text-xl')}>
            {t('description1')} <b>{t('description2')}</b> {t('description3')} <b>{t('description4')}</b> {t('description5')}
        </h2>
    </section>;
}