import AppLinks from "@/shared/constants/variables/links";
import TitleSection from "./title_section";
import { getTranslations } from "@/shared/localization/server";
import type { ExperienceModel } from "@/shared/components/experience_card";
import ExperienceCard from "@/shared/components/experience_card";

export default async function WorkExperience(): Promise<Component> {
    const t = await getTranslations('HomePage.WorkExperience');

    const projects: ExperienceModel[] = t('jobs');

    return <section className="items-center flex flex-col p-4 md:p-8">
        <TitleSection link={AppLinks.workExperience} title={t('title')} />
        <ul className="max-w-3xl flex flex-col">
            {projects.map(
                (project, index) =>
                    <ExperienceCard key={project.title} {...project} isLast={projects.length - 1 === index} />
            )}
        </ul>
    </section>;
}