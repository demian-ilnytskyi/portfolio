import { cn } from "@/lib/utils";
import Link from "@/shared/components/custom_link";
import AppTextStyle from "@/shared/constants/styles/app_text_styles";

export default async function TitleSection({ title, link }: { title: string, link: string }): Promise<Component> {
    return <Link href={`#${link}`}>
        <h3 className={cn(
            AppTextStyle.h1Mob,
            "font-bold not-md:text-3xl text-center mb-6 hover:underline"
        )}>
            {title}
        </h3>
    </Link>;
}