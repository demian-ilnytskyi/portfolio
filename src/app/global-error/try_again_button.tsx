'use client'

import { cn } from "@/lib/utils";
import clearCookiesAndCache from "@/shared/helpers/clear_data_helper";

export default function TryAgainButton({ buttonText }: { buttonText: string }): Component {
    async function handleTryAgain() {
        await clearCookiesAndCache(); // Clear relevant cookies if needed

        window.location.reload();
    }

    return <button
        onClick={handleTryAgain}
        className={cn(
            "px-4 py-2 text-lg font-medium text-white bg-red-500 rounded-md hover:bg-red-400",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
        )}
    >
        {buttonText}
    </button>;
}