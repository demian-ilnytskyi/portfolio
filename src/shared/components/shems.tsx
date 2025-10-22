import Script from "next/script";
import KTextConstants from "../constants/variables/text_constants";
import AppLinks from "../constants/variables/links";
import { getBaseUrl } from "../helpers/metadata_helper";

interface TranslateModel {
    uk: string;
    en: string;
}

const pageName: Record<string, TranslateModel> = {
    home: {
        uk: "Головна",
        en: "Home",
    },
    projects: {
        uk: "Проєкти",
        en: "Projects",
    },
}

const profileJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "dateCreated": "2025-10-13T21:28:00-00:00",
    "dateModified": "2025-10-13T21:28:00-00:00",
    "mainEntity": {
        "@type": "Person",
        "name": KTextConstants.owner,
        "url": KTextConstants.baseUrl,
        "image": `${KTextConstants.baseUrl}/images/profile.png`,
        "sameAs": [
            KTextConstants.ownerGitHub,
            "https://www.linkedin.com/in/demian-ilnytskyi"
        ],
        "jobTitle": "Flutter Developer",
        ...(KTextConstants.currentCompany
            ? {
                "worksFor": {
                    "@type": "Organization",
                    "name": KTextConstants.currentCompany
                }
            }
            : {})
    }
});

function projectsBreadcrumbJsonLd(language: Language): string {
    const baseUrl = getBaseUrl(language);
    const map = {
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
        "name": "Projects Breadcrumb",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": pageName.home[language],
            "item": `${baseUrl}${language !== KTextConstants.defaultLocale ? '' : '/'}`
        }, {
            "@type": "ListItem",
            "position": 2,
            "name": pageName.projects[language],
            "item": `${baseUrl}${AppLinks.projectsPage}`
        }]
    }
    return JSON.stringify(map);
}

function projectBreadcrumbJsonLd({
    language,
    name,
    title
}: {
    title: string,
    name: string,
    language: Language
}): string {
    const baseUrl = getBaseUrl(language);
    const map = {
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
        "name": `Project ${name} Breadcrumb`,
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": pageName.home[language],
            "item": `${baseUrl}${language !== KTextConstants.defaultLocale ? '' : '/'}`
        }, {
            "@type": "ListItem",
            "position": 2,
            "name": pageName.projects[language],
            "item": `${baseUrl}${AppLinks.projectsPage}`
        }, {
            "@type": "ListItem",
            "position": 3,
            "name": title,
            "item": `${baseUrl}${AppLinks.projectsPage}/${name}`
        }]
    };
    return JSON.stringify(map);
}

function homeImageJsonLd(title: string): string {
    const map = {
        "@context": "https://schema.org/",
        "@type": "ImageObject",
        "contentUrl": KTextConstants.profileImageUrl,
        "creditText": title,
        "acquireLicensePage": `${KTextConstants.baseUrl}/#${AppLinks.connect}`,
        "copyrightNotice": KTextConstants.owner,
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "creator": {
            "@type": "Person",
            "name": KTextConstants.owner,
            "url": KTextConstants.baseUrl,
            "image": KTextConstants.profileImageUrl,
        },
    }
    return JSON.stringify(map);
}

function projectImageJsonLd({ name, title }: { title: string, name: string }): string {
    const map = {
        "@context": "https://schema.org/",
        "@type": "ImageObject",
        "contentUrl": `${KTextConstants.baseUrl}/images/${name}.png`,
        "creditText": title,
        "acquireLicensePage": `${KTextConstants.baseUrl}/#${AppLinks.connect}`,
        "copyrightNotice": KTextConstants.owner,
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "creator": {
            "@type": "Person",
            "name": KTextConstants.owner,
            "url": KTextConstants.baseUrl,
            "image": KTextConstants.profileImageUrl,
        },
    }
    return JSON.stringify(map);
}

export function PersonScheme(): Component {
    return <Script
        id="json-person-scheme"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: profileJsonLd }}
    />
}

export function HomeImageScheme({ title }: { title: string }): Component {
    return <Script
        id="json-home-image-scheme"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: homeImageJsonLd(title) }}
    />
}

export function ProjectImageScheme(props: { name: string, title: string }): Component {
    return <Script
        id={`json-${props.name}-image-scheme`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: projectImageJsonLd(props) }}
    />
}

export function ProjectsBreadcrumbScheme({ language }: { language: Language }): Component {
    return <Script
        id="json-products-scheme"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: projectsBreadcrumbJsonLd(language) }}
    />
}
export function ProjectBreadcrumbScheme(props: { name: string, language: Language, title: string }): Component {
    return <Script
        id={`json-${props.name}-scheme`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: projectBreadcrumbJsonLd(props) }}
    />
}
