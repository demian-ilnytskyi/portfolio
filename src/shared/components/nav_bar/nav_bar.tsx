// import { useTranslations } from "next-intl";
import AppTextStyle from "../../constants/styles/app_text_styles";
import { cn } from "@/lib/utils";
import NavigationMobDialog from "./nav_mob_dialog";
import Link from "@/shared/components/custom_link";
import LanguageSwitcher from "../language_switcher/language_switcher";
import { getTranslations } from "@/shared/localization/server";
import ThemeSwticher from "../theme_switcher/theme_switcher";
import AppLinks from "@/shared/constants/variables/links";
import KIcons from "@/shared/constants/components/icons";

export default async function NavigationBar({ isDark }: { isDark?: boolean }): Promise<Component> {
    const t = await getTranslations('NavigationBar');

    function Buttons() {
        return <>
            <_Button
                path={`#${AppLinks.aboutMe}`}
                text={t('aboutMe')}
                prefetch={false}
                icon={<KIcons.aboutMe className="cursor-pointer" />} />
            <_Button
                path={`#${AppLinks.workExperience}`}
                text={t('workExperience')}
                prefetch={false}
                icon={<KIcons.workExpirience className="cursor-pointer" />} />
        </>
    };

    return <header className="sticky top-0 flex justify-center m-0 p-0 w-full">
        <nav className={cn(
            "bg-blue-100 max-h-18 w-full rounded-b-4xl",
            "shadow-xl dark:bg-gray-700",
            "overflow-hidden flex justify-between items-center px-3 py-4"
        )}>
            <Link
                href={`#${AppLinks.homePage}`}
                className="flex items-center p-2 hover:scale-105 duration-200 drop-shadow-md active:scale-90 cursor-pointer"
                aria-label={t('home')}
                prefetch={false}>
                Demian Ilnutskiy
            </Link>
            <div className="flex flex-row items-center not-small-mobile:w-full not-small-mobile:justify-evenly space-x-6 not-tablet:hidden">
                <Buttons />
            </div>
            <div className="flex flex-row pr-3">
                <ThemeSwticher isDark={isDark} className="hidden tablet:flex mr-3" />
                <LanguageSwitcher className="hidden tablet:flex" />
                <NavigationMobDialog >
                    <Buttons />
                    <div className="flex flex-row gap-2 flex-wrap">
                        <LanguageSwitcher className="mr-3" />
                        <ThemeSwticher isDark={isDark} />
                    </div>
                </NavigationMobDialog>
            </div>
        </nav>
    </header>;
}

interface ButtonProps {
    text: string;
    path: string;
    icon?: Component;
    prefetch: boolean;
}

function _Button(props: ButtonProps) {
    return <Link
        href={props.path}
        className={cn(
            AppTextStyle.titleMedium,
            "my-4 flex items-center justify-center group text-base"
        )}
        prefetch={props.prefetch}>
        <div className={"h-full py-0 not-small-mobile:px-0 px-3 flex flex-row justify-center items-center"}>
            {props.icon && props.icon}
            <div className="flex-col flex items-center ml-2">
                <span>{props.text}</span>
                <div className={"w-0 h-0.5 relative top-1 transition-width duration-400 ease group-hover:w-full group-active:w-0"} />
            </div>
        </div>
    </Link>;

}
