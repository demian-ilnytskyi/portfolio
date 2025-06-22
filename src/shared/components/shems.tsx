import Script from "next/script";
import KTextConstants from "../constants/variables/text_constants";
import AppLinks from "../constants/variables/links";
import projects from "../constants/variables/projects";

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

const homeBreadcrumbJsonLd = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Home Page",
        "item": `${KTextConstants.baseUrl}/`
    }, {
        "@type": "ListItem",
        "position": 2,
        "name": "Projects Page",
        "item": `${KTextConstants.baseUrl}${AppLinks.projectsPage}`
    }, {
        "@type": "ListItem",
        "position": 3,
        "name": "Veteranam Info Page",
        "item": `${KTextConstants.baseUrl}${AppLinks.projectsPage}/${projects.at(0)?.name}`
    }]
}

const projectsBreadcrumbJsonLd = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Projects Page",
        "item": `${KTextConstants.baseUrl}${AppLinks.projectsPage}`
    }, {
        "@type": "ListItem",
        "position": 2,
        "name": "Veteranam Info Page",
        "item": `${KTextConstants.baseUrl}${AppLinks.projectsPage}/${projects.at(0)?.name}`
    }]
}

function projectBreadcrumbJsonLd(name: string) {
    return {
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Projects Page",
            "item": `${KTextConstants.baseUrl}${AppLinks.projectsPage}/${name}`
        }, {
            "@type": "ListItem",
            "position": 2,
            "name": "Veteranam Info Page",
            "item": `${KTextConstants.baseUrl}${AppLinks.projectsPage}`
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
export function HomeBreadcrumbScheme(): Component {
    return <Script
        id="json-ld-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: homeBreadcrumbJsonLd }}
    />
}
export function ProjectsBreadcrumbScheme(): Component {
    return <Script
        id="json-ld-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: projectsBreadcrumbJsonLd }}
    />
}
export function ProjectBreadcrumbScheme({ name }: { name: string }): Component {
    return <Script
        id="json-ld-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: projectBreadcrumbJsonLd(name) }}
    />
}