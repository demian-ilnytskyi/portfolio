"use client";

import KTextConstants from "@/shared/constants/variables/text_constants";
import { EnglishFlag, UkraineFlag } from "./flags";
import { LanguageSwitcher as LanguageSwitcherComponent, useLocale } from "optimized-next-intl";
import { cn } from "@/lib/utils";


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
    const locale = useLocale(); // Get the current path to maintain navigation context
    const nextLocale: Language = locale === KTextConstants.defaultLocale ? 'uk' : 'en';
    const ariaLabelText = nextLocale === 'uk' ? ukraineSwitcherText : englishSwitcherText;
    return <LanguageSwitcherComponent
        locale={nextLocale} // Set the target locale for the link
        className={cn(
            "flex flex-row bg-blue-50 rounded-4xl group dark:bg-gray-400", // Styling for the switcher container
            className
        )}
        aria-label={ariaLabelText}> {/* Call a function on click for additional logic if needed */}
        <UkraineFlag isActive={nextLocale === 'en'} />
        <EnglishFlag isActive={nextLocale === 'uk'} />
    </LanguageSwitcherComponent>
}
