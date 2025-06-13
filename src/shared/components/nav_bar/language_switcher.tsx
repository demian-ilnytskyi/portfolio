"use client";

import { usePathname } from "@/l18n/navigation";
import Link from "@/shared/components/custom_link";
import { cn } from "@/lib/utils";
import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import { useLocale } from "next-intl";
import languageSwitchFunction from "./language_swticher_function";

export default function LanguageSwitcher({ className }: { className?: string }): Component {
    const itemsClass = cn(
        'min-w-10 min-h-10 bg-neutral rounded-full m-1 p-2 text-secondary text-center',
        AppTextStyle.titleMedium,
    );
    const locale = useLocale() as Language;
    const pathname = usePathname();
    const activeClass = 'bg-secondary text-neutral';
    const nextLocale: Language = locale === 'uk' ? 'en' : 'uk';
    return <Link
        href={pathname}
        locale={nextLocale}
        className={cn(
            // ButtonStyles.white,
            "flex flex-row",
            className
        )}
        prefetch={false}
        onClick={() => languageSwitchFunction(nextLocale)}>
        <span className={cn(
            itemsClass,
            (locale === 'uk' && activeClass),
        )}>
            UA
        </span>
        <span className={cn(
            itemsClass,
            (locale === 'en' && activeClass),
        )}>
            EN
        </span>
    </Link>
}