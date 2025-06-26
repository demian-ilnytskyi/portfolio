import HomeImagePart from "./home_components/image_part";
import AboutMe from "./home_components/about_me";
import AppLinks from "@/shared/constants/variables/links";
import WorkExperience from "./home_components/work_experience";
import ContactSection from "./home_components/contact_section";
import CardDivider from "@/shared/components/card_divider";
import ContactFormContent from "./home_components/contact_form/contact_form_content";
import Divider from "@/shared/components/divider";
import { HomeBreadcrumbScheme } from "@/shared/components/shems";

export default function Home(): Component {
  return <main className="flex-1 flex flex-col">
    {/* Site Scheme For SEO Bots */}
    <HomeBreadcrumbScheme />

    <HomeImagePart />
    <Divider id={AppLinks.aboutMe} />
    <AboutMe />
    <Divider id={AppLinks.workExperience} />
    <WorkExperience />
    <Divider id={AppLinks.connect} />
    <ContactSection />
    <CardDivider className="max-w-3xl self-center" />
    <ContactFormContent />
  </main>

}
