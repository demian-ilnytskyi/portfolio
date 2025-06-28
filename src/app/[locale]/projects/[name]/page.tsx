import projects from "@/shared/constants/variables/projects";
import { getTranslations, Link, setLocale } from "optimized-next-intl";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from 'next/image';
import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import CustomMarkdown from "@/shared/components/markdown";
import siteFetchRepository from "@/shared/repositories/site_fetch_repository";
import { languages, openGraph } from "@/shared/helpers/metadata_helper";
import KTextConstants from "@/shared/constants/variables/text_constants";
import AppLinks from "@/shared/constants/variables/links";
import KIcons from "@/shared/constants/components/icons";
import { ProjectBreadcrumbScheme } from "@/shared/components/shems";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: {
    params: Promise<{ name: string, locale: Language }>
}): Promise<Metadata> {
    const { name, locale } = await params;

    const t = await getTranslations('Projects', locale);

    const project = t(name);

    const link = `${AppLinks.projectsPage}/${name}`;

    return {
        title: project?.title,
        description: project?.description,
        alternates: {
            canonical: locale === KTextConstants.defaultLocale ? KTextConstants.baseUrl + link : undefined,
            languages: languages(KTextConstants.baseUrl, link),
        },
        openGraph: openGraph(locale, `/images/${name}.png`)
    };
};

async function fetchProjectDetails({ locale, projectName }: { locale: Language, projectName: string }): Promise<string | null> {
    const path = `./${locale}/${projectName}.md`;

    const text = await siteFetchRepository.fetchTextData({ path });

    return text;
}

export default async function ProjectPage({ params }: { params: Promise<{ name: string, locale: Language }> }): Promise<Component> {
    const { name, locale } = await params;
    setLocale(locale);

    const fetchPolicyContent = await fetchProjectDetails({ locale, projectName: name });

    if (!fetchPolicyContent) {
        notFound();
    }

    const project = await getTranslations(`Projects.${name}`, locale);

    if (!project) {
        notFound();
    }

    const projectInfo = projects.find((project) => project.name === name);

    if (!projectInfo) {
        notFound();
    }

    const t = await getTranslations(`ProjectPage`, locale);

    return <main className="flex-1 flex flex-col max-w-5xl mt-5">
        {/* Site Scheme For SEO Bots */}
        <ProjectBreadcrumbScheme name={name} />

        <Link href={AppLinks.projectsPage} className="flex flex-wrap items-center gap-2 w-max pr-5 group">
            <div
                className={cn(
                    "p-2 rounded-full dark:bg-green-800 w-max dark:group-hover:bg-green-700",
                    "bg-green-600 group-hover:bg-green-400 duration-200"
                )}>
                <KIcons.arrowBack className="dark:text-black text-white cursor-pointer" />
            </div>
            {t('backToProjects')}
        </Link>
        <div className="flex-1 flex flex-col max-w-5xl mt-5">
            <Image
                src={projectInfo.image}
                alt={'Veteranam'}
                loading={'eager'}
                placeholder="blur"
                width={1024}
                height={576}
                fetchPriority="high"
                className="rounded-t-2xl bg-zinc-800"
                priority />
            <div className="px-5 mt-5 flex flex-col">
                <h1 className={cn(AppTextStyle.h1, 'text-center not-md:text-4xl font-bold')}>
                    {project('title')}
                </h1>
                <CustomMarkdown className={cn(AppTextStyle.bodyLarge, 'mt-5')} content={fetchPolicyContent} />

                {projectInfo.links.length > 0 && <>
                    <h3 className={cn(AppTextStyle.titleLargeBold, 'text-center')}>
                        {t('links')}
                    </h3> <div className="flex flex-wrap justify-center gap-4 self-center mt-5">
                        {projectInfo.links.map(
                            (linkModel) =>
                                <a
                                    key={linkModel.value}
                                    href={linkModel.value}
                                    className="inline-block link-block-2 w-inline-block hover:scale-105 duration-200"
                                    target="_blank"
                                    rel="noopener noreferrer"> {/* Added link-block-2 and w-inline-block */}
                                    <Image src={linkModel.image} width={180} height={54} alt={linkModel.value} />
                                </a>
                        )}
                    </div>
                </>}
                {(projectInfo.links.length <= 0 || !(projectInfo.hasCodeLink ?? true)) && <h4
                    className={cn(AppTextStyle.bodyMedium, 'text-center mt-5')}>
                    {t('emptyLinks')}
                </h4>}
            </div>
        </div>
    </main>
}