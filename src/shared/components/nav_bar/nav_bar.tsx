import KIcons from "../../constants/components/icons";

import { useTranslations } from "next-intl";
import AppTextStyle from "../../constants/styles/app_text_styles";
import { cn } from "@/lib/utils";
import NavigationMobDialog from "./nav_mob_dialog";
import KTextConstants from "@/shared/constants/variables/text_constants";
import Link from "@/shared/components/custom_link";
import LanguageSwitcher from "./language_switcher";

export default function NavigationBar(): Component {
    return <></>
    // const t = useTranslations('NavigationBar');
    // const pointComponent = <div className={"flex bg-secondary w-1 h-1 rounded-full"} />;

    // function Buttons({ addPoint }: { addPoint: boolean }) {
    //     return <>
    //         <_Button
    //             path={KTextConstants.discountsLink}
    //             text={t('discounts')}
    //             icon={
    //                 <div className={cn(
    //                     "ml-2 p-3 justify-self-center",
    //                     "rounded-full bg-source-seed max-w-12 max-h-12",
    //                     "group-hover:brightness-90 duration-200 group-active:brightness-75",
    //                     " shadow-sys-light-surface-dim shadow-xl"
    //                 )}>
    //                     <KIcons.tag className="cursor-pointer" />
    //                 </div>
    //             }
    //             prefetch={true} />
    //         {addPoint && pointComponent}
    //         <_Button
    //             path={KTextConstants.mobileAppLink}
    //             text={t('mobileApp')}
    //             prefetch={false} />
    //         {addPoint && pointComponent}
    //         <_Button
    //             path={KTextConstants.feedbackLink}
    //             text={t('contact')}
    //             prefetch={false} />
    //     </>
    // };

    // return <header className="flex justify-center mt-4 p-0 w-full">
    //     <nav className={cn("bg-neutral max-h-18 w-full rounded-4xl",
    //         "shadow-xl",
    //         "overflow-hidden flex justify-between items-center px-3 py-4")}>
    //         <Link
    //             href="/"
    //             className="flex items-center p-2 hover:scale-105 duration-200 drop-shadow-md active:scale-90 cursor-pointer"
    //             aria-label={t('home')}
    //             prefetch={false}>
    //             <KIcons.logo className="cursor-pointer" />
    //         </Link>
    //         <div className="flex flex-row items-center not-small-mobile:w-full not-small-mobile:justify-evenly space-x-6 not-tablet:hidden">
    //             <Buttons addPoint={true} />
    //         </div>
    //         <div className="flex flex-row pr-3">
    //             <LanguageSwitcher className="hidden tablet:flex" />
    //             <NavigationMobDialog >
    //                 <Buttons addPoint={false} />
    //                 <div className="flex flex-row gap-2 flex-wrap">
    //                     <LanguageSwitcher className="mr-5" />
    //                     <SocialIcons iconClass="text-xs pt-2 pb-3 pr-3 pl-3 h-12" />
    //                 </div>
    //             </NavigationMobDialog>
    //             {/* <DoubleButtonWidget
    //               textValue={KTextConstants.login}
    //               href={KTextConstants.userRoleLink}
    //             /> */}
    //         </div>
    //     </nav>
    // </header>

}

// interface ButtonProps {
//     text: string;
//     path: string;
//     icon?: Component;
//     prefetch: boolean;
// }

// function _Button(props: ButtonProps) {
//     return <Link
//         href={props.path}
//         className={cn(
//             AppTextStyle.titleMedium,
//             "my-4 flex items-center justify-center group text-base"
//         )}
//         prefetch={props.prefetch}>
//         <div className={"h-full py-0 not-small-mobile:px-0 px-3 flex flex-row justify-center items-center"}>
//             <div className="flex-col flex items-center">
//                 <span>{props.text}</span>
//                 <div className={"w-0 h-0.5 relative top-1 transition-width duration-400 ease group-hover:w-full bg-secondary group-active:w-0"} />
//             </div>

//             {props.icon && props.icon}
//         </div>
//     </Link>;

// }
