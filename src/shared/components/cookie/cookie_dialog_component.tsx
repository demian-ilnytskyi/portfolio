import Link from "@/shared/components/custom_link";
import SnackBar from "../dialogs/snack_bar";
import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import { cn } from "@/lib/utils";
import { getTranslations } from "@/shared/localization/server";
import CookieDialogButtons from "./cookie_dialog_buttons";

export default async function CookieDialogComponent(): Promise<Component> {
    const t = await getTranslations("CookiesDialog");

    const dialogId = "cookieConsentDialog";
    const dialogLabelId = "cookieConsentTitle";

    return <SnackBar
        id={dialogId}
        className={cn(
            "p-2 sm:p-6 flex flex-wrap",
            "sm:justify-between gap-2 sm:gap-4 top-0 sticky",
        )}
        aria-labelledby={dialogLabelId}>
        <h2 id={dialogLabelId} className={cn(AppTextStyle.bodyMedium, "sm:text-base max-[22rem]:text-xs text-sm leading-relaxed text-neutral")}>
            {t("description")}
            {" "}
            <Link
                href="/privacy-policy"
                className="underline hover:no-underline hover:text-neutral text-ref-neutral-neutral-60 font-bold"
                prefetch={false}>
                {t("privacyPolicy")}
            </Link>
        </h2>

        <div className="flex flex-wrap justify-between gap-2 sm w-max max-[72rem]:w-full">
            <CookieDialogButtons acceptNecessaryText={t("acceptNecessary")} acceptText={t("accept")} />
        </div>
    </SnackBar>;
}