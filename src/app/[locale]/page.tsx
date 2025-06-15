import { cn } from "@/lib/utils";
import HomeImagePart from "./home_components/image_part";
import AboutMe from "./home_components/about_me";
import { setPageLocaleAsync } from "@/shared/constants/variables/locale_helper";

export default async function Home({
  params
}: {
  params: Promise<{ locale: Language }>;
}): Promise<Component> {
  await setPageLocaleAsync(params);
  return <main className="flex-1 flex flex-col">
    <HomeImagePart />
    <Divider />
    <AboutMe />
    <Divider />
  </main>

}

function Divider(): Component {
  return <div className={cn(
    "h-0.5 w-full bg-gradient-to-r from-gray-100 via-gray-400 to-gray-100 my-10",
    "dark:from-gray-800 dark:via-gray-400 dark:to-gray-800"
  )} />;
}
