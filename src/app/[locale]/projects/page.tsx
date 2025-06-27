import AppLinks from "@/shared/constants/variables/links";
import metadataHelper from "@/shared/helpers/metadata_helper";
import { getTranslations } from "optimized-next-intl";
import type { Metadata } from "next";
import type { ProjectsProps } from "@/shared/components/projects_card";
import ProjectsCard from "@/shared/components/projects_card";
import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import projects from "@/shared/constants/variables/projects";
import { ProjectsBreadcrumbScheme } from "@/shared/components/shems";
import { cn } from "@/lib/utils";

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

export default async function Projects(): Promise<Component> {
    const tProjects = await getTranslations('Projects');
    const t = await getTranslations('ProjectsPage');


    return <main className="flex-1 flex flex-col">
        {/* Site Scheme For SEO Bots */}
        <ProjectsBreadcrumbScheme />

        <h1 className={cn(AppTextStyle.h1Tablet, 'text-center my-4')}>{t('title')}</h1>
        <ul className="grid grid-flow-row big-desk:grid-cols-2 grid-cols-1 gap-x-5 md:gap-y-10 big-desk:gap-y-5 gap-y-5">
            {projects.map((projectInfo, index) => {
                const projectDetail: ProjectsProps = tProjects(projectInfo?.name);
                return <ProjectsCard key={projectDetail.title} path={projectInfo.name} {...projectInfo} {...projectDetail} viewDetailText={t('details')} imagePriority={index <= 2} />
            })}
        </ul>
    </main>

}