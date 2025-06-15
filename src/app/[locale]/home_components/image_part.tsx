import AppTextStyle from "@/shared/constants/styles/app_text_styles";
import profileImage from "../../../../public/images/profile.jpg"
import Image from 'next/image';
import { cn } from "@/lib/utils";

export default function HomeImagePart(): Component {
    return <section className="items-center flex flex-col mt-10 min-h-[77vh]">
        <Image
            src={profileImage}
            alt={'Profile'}
            loading={'eager'}
            placeholder="blur"
            priority
            width={400}
            height={400}
            className="rounded-full border-gray-200 dark:border-0 border-2" />
        <h1 className={cn(AppTextStyle.h1, 'text-center not-tablet:text-5xl')}>
            Demian Ilnutskiy
        </h1>
        <h2 className={cn(AppTextStyle.titleLarge, 'text-center mt-3 not-tablet:text-2xl')}>
            I'm an <span className="font-bold">Associate Flutter Developer</span> crafting intuitive, high-performance <span className="font-bold">cross-platform</span> applications that deliver seamless user experiences.
        </h2>
    </section>;
}