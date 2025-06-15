// import { useTranslations } from "next-intl";
import AppTextStyle from "../../constants/styles/app_text_styles";
import { cn } from "@/lib/utils";
import NavigationMobDialog from "./nav_mob_dialog";
import Link from "@/shared/components/custom_link";
import LanguageSwitcher from "./language_switcher";
import { getTranslations } from "@/shared/localization/server";

export default async function NavigationBar(): Promise<Component> {
    const t = await getTranslations('NavigationBar');

    function Buttons() {
        return <>
            <_Button
                path={'/test'}
                text={t('contact')}
                prefetch={false} />
        </>
    };

    return <header className="flex justify-center mt-4 p-0 w-full">
        <nav className={cn(
            "bg-blue-100 max-h-18 w-full rounded-4xl",
            "shadow-xl",
            "overflow-hidden flex justify-between items-center px-3 py-4"
        )}>
            <Link
                href="/"
                className="flex items-center p-2 hover:scale-105 duration-200 drop-shadow-md active:scale-90 cursor-pointer"
                aria-label={t('home')}
                prefetch={false}>
                Demian Ilnutskiy
            </Link>
            <div className="flex flex-row items-center not-small-mobile:w-full not-small-mobile:justify-evenly space-x-6 not-tablet:hidden">
                <Buttons />
            </div>
            <div className="flex flex-row pr-3">
                <LanguageSwitcher className="hidden tablet:flex" />
                <NavigationMobDialog >
                    <Buttons />
                    <div className="flex flex-row gap-2 flex-wrap">
                        <LanguageSwitcher className="mr-5" />
                    </div>
                </NavigationMobDialog>
            </div>
        </nav>
    </header>

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
            <div className="flex-col flex items-center">
                <span>{props.text}</span>
                <div className={"w-0 h-0.5 relative top-1 transition-width duration-400 ease group-hover:w-full bg-secondary group-active:w-0"} />
            </div>

            {props.icon && props.icon}
        </div>
    </Link>;

}
