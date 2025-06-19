import AppLinks from "@/shared/constants/variables/links";
import TitleSection from "./title_section";
import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import { cn } from "@/lib/utils";
import SocilaCard from "@/shared/components/social_card";
import KIcons from "@/shared/constants/components/icons";
import { getTranslations } from "@/shared/localization/server";

export interface ContactListProps {
    link: string;
    Icon: ({ className }: { className: string }) => Component;
}

export interface ContactListTextProps {
    title: string;
    description: string;
}

const contactList: ContactListProps[] = [
    {
        Icon: ({ className }) => <KIcons.email className={className} />,
        link: "mailto:demien.ilnutskiy@gmail.com",
    },
    {
        Icon: ({ className }) => <KIcons.linkedin className={className} />,
        link: "https://www.linkedin.com/in/demian-ilnytskyi-54367a268",
    },
    {
        Icon: ({ className }) => <KIcons.github className={className} />,
        link: "https://github.com/DemienIlnutskiy",
    },
]

export default async function ContactSection(): Promise<Component> {
    const t = await getTranslations('HomePage.Connect');

    const contactText: ContactListTextProps[] = t('social');

    return <section className="items-center flex flex-col p-4 md:p-8 max-w-3xl self-center">
        <TitleSection link={AppLinks.connect} title={t('title')} />
        <h5 className={cn(
            AppTextStyle.titleLargeBold,
            "font-bold not-md:text-3xl text-center mb-10 dark:text-gray-300 text-gray-500"
        )}>{t('description')}</h5>
        <ul className="grid grid-cols-1 gap-7 tablet:grid-cols-2">
            {contactText.map((contact, i) => {
                const contactItem = contactList.at(i);
                return <SocilaCard key={contact.title} {...contact} {...contactItem} />
            })}
        </ul>
    </section>
}