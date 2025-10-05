import { cn } from "@/lib/utils";
import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import { Link } from "optimized-next-intl";

export default function TitleSection({ title, link }: { title: string, link: string }): Component {
    return <Link href={`#${link}`}>
        <h3 className={cn(
            AppTextStyle.h1Mob,
            "font-bold not-md:text-3xl text-center mb-6 hover:underline"
        )}>
            {title}
        </h3>
    </Link>;
}