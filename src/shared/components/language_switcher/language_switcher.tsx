"use client";

// import { usePathname } from "@/l18n/navigation";
import Link from "@/shared/components/custom_link";
import { cn } from "@/lib/utils";
// import { useLocale } from "next-intl";
import languageSwitchFunction from "../language_switcher/language_swticher_function";
import { EnglishFlag, UkraineFlag } from "./flags";
import { usePathname } from "next/navigation";


/**
 * LanguageSwitcher component allows users to switch between Ukrainian and English languages.
 * It displays two flags, one for each language, and highlights the currently active language.
 * When a flag is clicked, it navigates to the same page with the selected locale.
 */
export default function LanguageSwitcher({ className, englishSwitcherText, ukraineSwitcherText }: {
    className?: string,
    ukraineSwitcherText: string,
    englishSwitcherText: string
}): Component {
    const pathname = usePathname(); // Get the current path to maintain navigation context
    const nextLocale: Language = pathname.includes('en') ? 'uk' : 'en';
    const ariaLabelText = nextLocale === 'uk' ? ukraineSwitcherText : englishSwitcherText;
    const cleanPath = pathname.replace(/^\/(uk|en)/, '');
    return <Link
        href={cleanPath} // Link to the current path
        locale={nextLocale} // Set the target locale for the link
        className={cn(
            "flex flex-row bg-blue-50 rounded-4xl group dark:bg-gray-400", // Styling for the switcher container
            className
        )}
        prefetch={false} // Disable prefetching for better control over locale switching
        onClick={() => languageSwitchFunction(nextLocale)}
        aria-label={ariaLabelText}> {/* Call a function on click for additional logic if needed */}
        <UkraineFlag isActive={nextLocale === 'en'} />
        <EnglishFlag isActive={nextLocale === 'uk'} />
    </Link>
}
