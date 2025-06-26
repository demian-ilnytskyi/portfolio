import { cn } from "optimized-next-intl";
import AppTextStyle from "../constants/styles/app_text_styles";

export interface SocilaCardProps {
    title: string;
    description: string;
    link?: string;
    Icon?: ({ className }: { className: string }) => Component;
}

export default function SocilaCard({
    title,
    description,
    Icon,
    link,
}: SocilaCardProps): Component {
    return <li >
        <a className={cn(
            "dark:bg-gray-800 border-2 dark:border-gray-800 shadow dark:shadow-gray-300",
            "flex flex-wrap px-5 py-2 rounded-3xl",
            "bg-gray-50 border-gray-50 shadow-gray-700 hover:scale-105 duration-300"
        )}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={title}>
            {Icon && <Icon className="w-10 h-10 self-center dark:text-gray-300 text-gray-500" />}
            <div className="flex flex-col ml-5">
                <p className={cn(
                    AppTextStyle.titleMedium,
                    'dark:text-gray-200 text-gray-600'
                )}>
                    {title}
                </p>
                <div className="h-0.5 w-full from-gray-400 to-gay-600 bg-gradient-to-t my-1" />
                <p className={cn(
                    AppTextStyle.bodyMedium,
                    'dark:text-gray-300 text-gray-500'
                )}>
                    {description}
                </p>
            </div>
        </a>
    </li>
}