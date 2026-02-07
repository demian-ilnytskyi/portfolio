import AppLinks from "@/shared/constants/variables/links";
import TitleSection from "./title_section";
import { getTranslations, Link } from "cloudflare-next-intl";
import type { ExperienceModel } from "@/shared/components/experience_card";
import ExperienceCard from "@/shared/components/experience_card";
import { cn } from "@/lib/utils";

export default async function WorkExperience(): Promise<Component> {
    const t = await getTranslations("HomePage.WorkExperience");

    const projects: ExperienceModel[] = t("jobs");

    return (
        <section className="items-center flex flex-col p-4 md:p-8">
            <TitleSection link={AppLinks.workExperience} title={t("title")} />
            <ul className="max-w-3xl flex flex-col">
                {projects.map(
                    (project, index) => (
                        <ExperienceCard
                            key={project.title}
                            {...project}
                            isLast={projects.length - 1 === index}
                            index={index}
                        />
                    ),
                )}
            </ul>
            <Link
                href={AppLinks.projectsPage}
                className={cn(
                    "dark:bg-blue-800 px-5 py-2 mt-10 rounded-2xl border dark:border-gray-400",
                    "dark:hover:bg-blue-700 ring-1 dark:ring-blue-300 duration-200 bg-blue-200",
                    "border-gray-500 ring-blue-600 hover:bg-blue-300",
                )}
            >
                {t("fullList")}
            </Link>
        </section>
    );
}
