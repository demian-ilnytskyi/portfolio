import AppTextStyle from "../constants/styles/app_text_styles";
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import { Link } from "optimized-next-intl";
import AppLinks from "../constants/variables/links";
import CustomMarkdown from "./markdown";
import { cn } from "@/lib/utils";

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
            width={800}
            height={400}
            alt={'Veteranam'}
            loading={'eager'}
            placeholder="blur"
            className="rounded-t-2xl bg-zinc-800 self-center"
            fetchPriority={imagePriority ? "high" : 'auto'}
            priority={imagePriority} />
        <div className="px-5 mt-2 flex flex-col">
            <h2 className={cn(AppTextStyle.titleLargeBold, 'text-center')}>
                {title}
            </h2>
            <CustomMarkdown className={cn(AppTextStyle.bodyLarge, 'line-clamp-4')} content={description} />
            <div className="flex flex-row justify-between items-center mt-3 gap-2">
                <span className={cn(
                    "px-4 py-1 bg-blue-100 dark:bg-cyan-900 rounded-4xl dark:text-gray-200 text-gray-700",
                    "line-clamp-2 overflow-ellipsis"
                )}>
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