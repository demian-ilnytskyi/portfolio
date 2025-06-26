import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import Image from 'next/image';
import { getTranslations, cn } from "optimized-next-intl";

import profileImage from "../../../../public/images/profile.png"

export default async function HomeImagePart(): Promise<Component> {
    const t = await getTranslations('HomePage.ImagePart');
    return <section className="items-center flex flex-col mt-10 min-h-[77vh]">
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
        <h1 className={cn(AppTextStyle.h1, 'text-center not-tablet:text-5xl mt-5')}>
            {t('title')}
        </h1>
        <h2 className={cn(AppTextStyle.titleLarge, 'text-center mt-3 not-tablet:text-2xl')}>
            {t('description1')} <b>{t('description2')}</b> {t('description3')} <b>{t('description4')}</b> {t('description5')}
        </h2>
    </section>;
}