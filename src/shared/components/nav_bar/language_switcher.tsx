"use client";

// import { usePathname } from "@/l18n/navigation";
import Link from "@/shared/components/custom_link";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import languageSwitchFunction from "./language_swticher_function";
import { EnglishFlag, UkraineFlag } from "./flags";
import { usePathname } from "next/navigation";


/**
 * LanguageSwitcher component allows users to switch between Ukrainian and English languages.
 * It displays two flags, one for each language, and highlights the currently active language.
 * When a flag is clicked, it navigates to the same page with the selected locale.
 */
export default function LanguageSwitcher({ className }: { className?: string }): Component {
    const locale = useLocale() as Language; // Get the current locale
    const pathname = usePathname().replace(`/${locale}`, ''); // Get the current path to maintain navigation context
    // Determine the next locale to switch to
    const nextLocale: Language = locale === 'uk' ? 'en' : 'uk';

    return <Link
        href={pathname} // Link to the current path
        locale={nextLocale} // Set the target locale for the link
        className={cn(
            "flex flex-row bg-blue-50 rounded-4xl group", // Styling for the switcher container
            className
        )}
        prefetch={false} // Disable prefetching for better control over locale switching
        onClick={() => languageSwitchFunction(nextLocale)}> {/* Call a function on click for additional logic if needed */}
        <UkraineFlag isActive={locale === 'uk'} /> {/* Render Ukraine flag, active if current locale is 'uk' */}
        <EnglishFlag isActive={locale === 'en'} /> {/* Render English flag, active if current locale is 'en' */}
    </Link>
}
