const veteranam = "/images/veteranam-info.png";
const checkMyBuilding = "/images/check-my-building.png";
const livaClinicImage = "/images/liva-clinic.png";
const hungerQuestImage = "/images/hunger-quest.png";
const IceCreamTimeImage = "/images/ice-cream-time.png";

const appStoreIcon = "/icons/app_store.svg";
const googlePlayIcon = "/icons/play_market.svg";
const webIcon = "/icons/web.svg";
const figmaIcon = "/icons/figma.svg";
const githubIcon = "/icons/git_hub.svg";

export interface ProjectProps {
    name: string;
    image: string;
    links: { image: string, value: string, label: string }[];
    hasCodeLink?: boolean;
}

const projects: ProjectProps[] = [
    {
        image: veteranam,
        name: 'veteranam-info',
        links: [
            {
                image: appStoreIcon,
                value: "https://apps.apple.com/us/app/veteranam-info/id6584519009",
                label: "App Store",
            },
            {
                image: googlePlayIcon,
                value: "https://play.google.com/store/apps/details?id=info.veteranam",
                label: "Google Play",
            },
            {
                image: webIcon,
                value: "https://veteranam.info",
                label: "Website",
            },
            {
                image: githubIcon,
                value: "https://github.com/CodingHouseStudio/veteranam_info",
                label: "GitHub",
            },
            {
                image: figmaIcon,
                value: "https://www.figma.com/design/W9Xbu0ajz9LTH1hxXpQFgy/Veteran?node-id=10-102&p=f&t=eceU352NjGy7x9Ok-0",
                label: "Figma",
            },
        ],
    },
    {
        image: checkMyBuilding,
        name: 'check-my-building',
        links: [
            {
                image: figmaIcon,
                value: "https://www.figma.com/design/zY5Oqp6f6UDrtyAzKXX4eg/CheckMyBuilding?node-id=114-3&t=v73XkFNC9f6D0QZs-1",
                label: "Figma",
            },
        ],
        hasCodeLink: false,
    },
    {
        image: IceCreamTimeImage,
        name: 'ice-cream-time',
        links: [],
        hasCodeLink: false,
    },
    {
        image: livaClinicImage,
        name: 'liva-clinic',
        links: [],
    },
    {
        image: hungerQuestImage,
        name: 'hunger-quest',
        links: [
            {
                image: webIcon,
                value: "https://hungerquest.app",
                label: "Website",
            },
        ]
    },
]

export default projects;