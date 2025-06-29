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

function getBaseUrl(language: Language) {
    if (language !== KTextConstants.defaultLocale) {
        return `${KTextConstants.baseUrl}/${language}`;
    } else {
        return KTextConstants.baseUrl;
    }
}

const personJsonLd = JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "Person",
    "name": KTextConstants.owner,
    "url": KTextConstants.baseUrl,
    "image": `${KTextConstants.baseUrl}/images/profile.png`,
    "sameAs": [
        KTextConstants.ownerGitHub,
        "https://www.linkedin.com/in/demian-ilnytskyi-54367a268/"
    ],
    "jobTitle": "Flutter Developer",
    "worksFor": {
        "@type": "Organization",
        "name": KTextConstants.currentCompany
    }
});

function projectsBreadcrumbJsonLd(language: Language): string {
    const baseUrl = getBaseUrl(language);
    const map = {
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

export function PersonScheme(): Component {
    return <Script
        id="json-person-scheme"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: personJsonLd }}
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