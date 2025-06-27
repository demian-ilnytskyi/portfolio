// import { useTranslations } from "next-intl";
import AppTextStyle from "../../constants/styles/app_text_styles";
import NavigationMobDialog from "./nav_mob_dialog";
import LanguageSwitcher from "../language_switcher/language_switcher";
import { getTranslations, Link } from "optimized-next-intl";
import AppLinks from "@/shared/constants/variables/links";
import KIcons from "@/shared/constants/components/icons";
import ThemeSwticher from "optimized-next-intl/ThemeSwitcher";
import { cn } from "@/lib/utils";

export default async function NavigationBar({ isDark }: { isDark?: boolean }): Promise<Component> {
    const t = await getTranslations('NavigationBar');

    function Buttons() {
        return <>
            <_Button
                path={`/#${AppLinks.aboutMe}`}
                text={t('aboutMe')}
                prefetch={false}
                icon={<KIcons.aboutMe className="cursor-pointer" />} />
            <_Button
                path={`/#${AppLinks.workExperience}`}
                text={t('workExperience')}
                prefetch={false}
                icon={<KIcons.workExpirience className="cursor-pointer" />} />
            <_Button
                path={`/#${AppLinks.connect}`}
                text={t('connect')}
                prefetch={false}
                icon={<KIcons.connect className="cursor-pointer" />} />
        </>
    };
    const lightModeText = t('lightMode');
    const darkModeText = t('darkMode');
    const ukSwitchText = t('ukSwitcherLabel');
    const enSwitchText = t('enSwitcherLabel');

    return <header className="sticky top-0 flex justify-center m-0 p-0 w-full z-10">
        <nav className={cn(
            "bg-blue-100 max-h-18 w-full rounded-b-4xl",
            "shadow-xl dark:bg-gray-700",
            "overflow-hidden flex justify-between items-center px-3 py-4"
        )}>
            <Link
                href={`/#${AppLinks.homePage}`}
                className={cn(
                    "flex items-center p-2 hover:scale-110 hover:underline",
                    "duration-200 drop-shadow-md active:scale-90 cursor-pointer"
                )}
                aria-label={t('home')}
                prefetch={false}>
                {t('logo')}
            </Link>
            <div className="flex flex-row items-center not-small-mobile:w-full not-small-mobile:justify-evenly space-x-6 not-tablet:hidden">
                <Buttons />
            </div>
            <div className="flex flex-row pr-3">
                <ThemeSwticher
                    isDark={isDark}
                    className="hidden tablet:flex mr-3"
                    lightLabelText={lightModeText}
                    darkLabelText={darkModeText} />
                <LanguageSwitcher
                    className="hidden tablet:flex"
                    ukraineSwitcherText={ukSwitchText}
                    englishSwitcherText={enSwitchText} />
                <NavigationMobDialog ariaLabel={t('dialogLabel')} >
                    <Buttons />
                    <div className="flex flex-row gap-2 flex-wrap mt-2">
                        <LanguageSwitcher
                            className="mr-3"
                            ukraineSwitcherText={ukSwitchText}
                            englishSwitcherText={enSwitchText} />
                        <ThemeSwticher isDark={isDark} lightLabelText={lightModeText} darkLabelText={darkModeText} />
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
            "flex items-center justify-center group text-base hover:scale-105 duration-200"
        )}
        prefetch={props.prefetch}>
        <div className={"h-full py-0 not-small-mobile:px-0 px-3 flex flex-row justify-center items-center"}>
            {props.icon && props.icon}
            <div className="flex-col flex items-center ml-2 hover:underline duration-200">
                <span>{props.text}</span>
            </div>
        </div>
    </Link>;

}
