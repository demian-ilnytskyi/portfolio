import Script from "next/script";
import KTextConstants from "../constants/variables/text_constants";
import AppLinks from "../constants/variables/links";

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

const personJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Person",
    "name": KTextConstants.owner,
    "url": KTextConstants.baseUrl,
    "image": `${KTextConstants.owner}/images/profile.png`,
    "sameAs": [
        KTextConstants.ownerGitHub,
        KTextConstants.baseUrl,
        "https://www.linkedin.com/in/demian-ilnytskyi-54367a268/"
    ],
    "jobTitle": "Flutter Developer",
    "worksFor": {
        "@type": "Organization",
        "name": KTextConstants.currentCompany
    }
}

function getBaseUrl(language: Language) {
    if (language !== KTextConstants.defaultLocale) {
        return `${KTextConstants.baseUrl}/${language}`;
    } else {
        return KTextConstants.baseUrl;
    }
}

function projectsBreadcrumbJsonLd(language: Language) {
    const baseUrl = getBaseUrl(language);
    return {
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
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
}

function projectBreadcrumbJsonLd({
    language,
    name,
    title
}: {
    title: string,
    name: string,
    language: Language
}) {
    const baseUrl = getBaseUrl(language);
    return {
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
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
}

export function PersonScheme(): Component {
    return <Script
        id="json-ld-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: personJsonLd }}
    />
}

export function ProjectsBreadcrumbScheme({ language }: { language: Language }): Component {
    return <Script
        id="json-ld-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: projectsBreadcrumbJsonLd(language) }}
    />
}
export function ProjectBreadcrumbScheme(props: { name: string, language: Language, title: string }): Component {
    return <Script
        id="json-ld-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: projectBreadcrumbJsonLd(props) }}
    />
}