import { setPageLocaleAsync } from "@/shared/constants/variables/locale_helper";
import AppLinks from "@/shared/constants/variables/links";
import metadataHelper from "@/shared/helpers/metadata_helper";
import { getTranslations } from "@/shared/localization/server";
import type { Metadata } from "next";
import type { ProjectsProps } from "@/shared/components/projects_card";
import ProjectsCard from "@/shared/components/projects_card";
import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import { cn } from "@/lib/utils";
import projects from "@/shared/constants/variables/projects";

export async function generateMetadata({ params }: {
    params: Promise<{ locale: Language }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations('Metadata.Projects', locale,);
    return metadataHelper({
        t: t,
        linkPart: AppLinks.projectsPage,
        locale: locale,
    });
};

export default async function Projects({
    params
}: {
    params: Promise<{ locale: Language }>;
}): Promise<Component> {
    await setPageLocaleAsync(params);

    const tProjects = await getTranslations('Projects');
    const t = await getTranslations('ProjectsPage');

    const projectsText: ProjectsProps[] = tProjects('list');

    return <main className="flex-1 flex flex-col">
        <h1 className={cn(AppTextStyle.h1Tablet, 'text-center my-4')}>{t('title')}</h1>
        <ul className="grid grid-flow-row big-desk:grid-cols-2 grid-cols-1 gap-5">
            {projectsText.map((project, index) => {
                const images = projects.at(index);
                return <ProjectsCard key={project.title} {...project} viewDetailText={t('details')} imagePriority={index <= 2} image={images?.image} />
            })}
        </ul>
    </main>

}