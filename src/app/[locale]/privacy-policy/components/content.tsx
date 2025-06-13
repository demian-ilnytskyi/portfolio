import CustomMarkdown from "@/shared/components/markdown";
import AppLinks from "@/shared/constants/variables/links";
import fetchRepository from "@/shared/repository/site_fetch_repository";

const ERROR_MESSAGES = {
    en: "## Privacy Policy Unavailable",
    uk: "## Політика конфіденційності недоступна",
} as const;
interface FetchPolicyParams {
    locale: Language;
}

// Main fetch function
async function fetchPolicyContent({ locale }: FetchPolicyParams): Promise<string> {
    const errorMessage = ERROR_MESSAGES[locale] || ERROR_MESSAGES.en; // Fallback to English

    const path = `./${locale}${AppLinks.privacyPolicyLink}.txt`;

    const text = await fetchRepository.fetch({ path });

    return text ? text : errorMessage;
}

// Component
export default async function PrivacyPolicyContent({ locale }: { locale: Language }): Promise<Component> {
    const policyContent = await fetchPolicyContent({ locale: locale });
    return <CustomMarkdown content={policyContent} />;
}