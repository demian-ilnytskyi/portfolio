'use client'

import clearCookiesAndCache from "@/shared/helpers/clear_data_helper";

export default function TryAgainButton({ buttonText }: { buttonText: string }): Component {
    async function handleTryAgain() {
        await clearCookiesAndCache(); // Clear relevant cookies if needed

        window.location.reload();
    }

    return <button
        onClick={handleTryAgain}
        className="px-4 py-2 text-lg font-medium text-white bg-ref-error-error-50 rounded-md hover:bg-ref-error-error-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ref-error-error-50"
    >
        {buttonText}
    </button>;
}