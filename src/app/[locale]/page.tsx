import { cn } from "@/lib/utils";
import HomeImagePart from "./home_components/image_part";
import AboutMe from "./home_components/about_me";
import { setPageLocaleAsync } from "@/shared/constants/variables/locale_helper";
import AppLinks from "@/shared/constants/variables/links";
import WorkExperience from "./home_components/work_experience";
import ContactSection from "./home_components/contact_section";
import CardDivider from "@/shared/components/card_divider";
import ContactFormContent from "./home_components/contact_form/contact_form_content";

export default async function Home({
  params
}: {
  params: Promise<{ locale: Language }>;
}): Promise<Component> {
  await setPageLocaleAsync(params);
  return <main className="flex-1 flex flex-col">
    <HomeImagePart />
    <Divider id={AppLinks.aboutMe} />
    <AboutMe />
    <Divider id={AppLinks.workExperience} />
    <WorkExperience />
    <Divider id={AppLinks.contact} />
    <ContactSection />
    <CardDivider className="max-w-3xl self-center" />
    <ContactFormContent />
    <Divider />
  </main>

}

function Divider({ id }: { id?: string }): Component {
  return <>
    <div id={id} />
    <div
      className={cn(
        "h-0.5 w-full bg-gradient-to-r from-gray-100 via-gray-400 to-gray-100 my-10",
        "dark:from-gray-800 dark:via-gray-400 dark:to-gray-800"
      )} />
  </>;
}
