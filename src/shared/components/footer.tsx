import AppTextStyle from "../constants/styles/app_text_styles";
import KIcons from "../constants/components/icons";
import KTextConstants from "../constants/variables/text_constants";
import { cn } from "@/lib/utils";
import { getTranslations } from "cloudflare-next-intl";

export default async function Footer(): Promise<Component> {
    const t = await getTranslations("Footer");

    return (
        <footer
            className={cn(
                "flex flex-col rounded-t-4xl py-4 px-10 bg-blue-100 dark:bg-gray-700 mt-10",
            )}
        >
            <div className="flex not-sm:flex-wrap gap-5 sm:justify-between justify-center items-center">
                <p className={AppTextStyle.bodyMedium}>
                    © {KTextConstants.buildDate.getFullYear()} {t("content")}
                </p>
                <a
                    href={KTextConstants.projectGitHubLink}
                    className={cn(
                        "flex flex-row py-2 px-3 rounded-4xl bg-blue-200 cursor-pointer space-x-2 dark:bg-gray-900",
                        "hover:bg-blue-300 dark:hover:bg-blue-950 items-center",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={"GitHub"}
                >
                    <KIcons.github className="cursor-pointer" />
                    <p className={AppTextStyle.bodyMedium}>
                        {t("viewSource")}
                    </p>
                </a>
            </div>
            <p className={cn(AppTextStyle.bodySmall, "text-center mt-5")}>
                {t("subtitle")}
            </p>
        </footer>
    );
}
