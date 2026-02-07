import AppLinks from "@/shared/constants/variables/links";
import TitleSection from "./title_section";
import { cn } from "@/lib/utils";
import { getTranslations } from "cloudflare-next-intl";

export default async function AboutMe(): Promise<Component> {
    const t = await getTranslations("HomePage.AboutMe");
    const paragraphClass = cn("text-lg leading-relaxed");

    return (
        <section className="items-center flex flex-col p-4 md:p-8">
            <TitleSection link={AppLinks.aboutMe} title={t("title")} />
            <div className="max-w-3xl flex flex-col space-y-8 my-10">
                <p className={paragraphClass}>
                    {t("paragraph1.part1")} <b>{t("paragraph1.part2")}</b>{" "}
                    {t("paragraph1.part3")} <b>{t("paragraph1.part4")}</b>{" "}
                    {t("paragraph1.part5")} <b>{t("paragraph1.part6")}</b>{" "}
                    {t("paragraph1.part7")} <b>{t("paragraph1.part8")}</b>{" "}
                    {t("paragraph1.part9")}
                </p>
                <p className={paragraphClass}>
                    {t("paragraph2.part1")} <b>{t("paragraph2.part2")}</b>{" "}
                    {t("paragraph2.part3")} <b>{t("paragraph2.part4")}</b>{" "}
                    {t("paragraph2.part5")} <b>{t("paragraph2.part6")}</b>{" "}
                    {t("paragraph2.part7")} <b>{t("paragraph2.part8")}</b>{" "}
                    {t("paragraph2.part9")}
                </p>
                <p className={paragraphClass}>
                    {t("paragraph3.part1")} <b>{t("paragraph3.part2")}</b>{" "}
                    {t("paragraph3.part3")} <b>{t("paragraph3.part4")}</b>{" "}
                    {t("paragraph3.part5")}
                </p>
            </div>
        </section>
    );
}
