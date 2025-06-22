import AppTextStyle from "../constants/styles/app_text_styles";
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import Link from "./custom_link";
import AppLinks from "../constants/variables/links";
import CustomMarkdown from "./markdown";

export interface ProjectsProps {
    title: string;
    description: string;
    period: string;
}

export interface ProjectsCardProps extends ProjectsProps {
    viewDetailText: string;
    image: StaticImageData;
    imagePriority?: boolean;
    path: string;
}

export default function ProjectsCard({
    description,
    image,
    title,
    viewDetailText,
    imagePriority,
    period,
    path,
}: ProjectsCardProps): Component {
    return <li className="pb-3 dark:bg-blue-950 bg-blue-200 rounded-2xl flex flex-col">
        <Image
            src={image}
            alt={'Veteranam'}
            loading={'eager'}
            placeholder="blur"
            className="rounded-t-2xl bg-zinc-800"
            fetchPriority={imagePriority ? "high" : 'auto'}
            priority={imagePriority} />
        <div className="px-5 mt-2 flex flex-col">
            <h2 className={cn(AppTextStyle.titleLargeBold, 'text-center')}>
                {title}
            </h2>
            <CustomMarkdown className={cn(AppTextStyle.bodyLarge, 'line-clamp-4')} content={description} />
            <div className="flex flex-row justify-between items-center mt-3 gap-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-cyan-900 rounded-4xl dark:text-gray-200 text-gray-500">
                    {period}
                </span>
                <Link
                    href={`${AppLinks.projectsPage}/${path}`}
                    className={cn(
                        "px-3 py-1 dark:bg-cyan-700 rounded-4xl w-max dark:hover:bg-cyan-600",
                        AppTextStyle.titleMediumBold,
                        "bg-cyan-300 hover:bg-cyan-400 font-le tracking-wider"
                    )}>
                    {viewDetailText}
                </Link>
            </div>
        </div>
    </li>
}