import type { StaticImageData } from "next/image";

import veteranam from "../../../../public/images/veteranam-info.png";
import checkMyBuilding from "../../../../public/images/check-my-building.png";
import livaClinicImage from "../../../../public/images/liva-clinic.png";
import hungerQuestImage from "../../../../public/images/hunger-quest.png";

import appStoreIcon from "../../../../public/icons/app_store.svg";
import googlePlayIcon from "../../../../public/icons/play_market.svg";
import webIcon from "../../../../public/icons/web.svg";
import figmaIcon from "../../../../public/icons/figma.svg";
import githubIcon from "../../../../public/icons/git_hub.svg";

export interface ProjectProps {
    name: string;
    image: StaticImageData;
    links: { image: StaticImageData, value: string }[];
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
            },
            {
                image: googlePlayIcon,
                value: "https://play.google.com/store/apps/details?id=info.veteranam",
            },
            {
                image: webIcon,
                value: "https://veteranam.info/en",
            },
            {
                image: githubIcon,
                value: "https://github.com/CodingHouseStudio/veteranam_info",
            },
            {
                image: figmaIcon,
                value: "https://www.figma.com/design/zY5Oqp6f6UDrtyAzKXX4eg/CheckMyBuilding?node-id=114-3&t=v73XkFNC9f6D0QZs-1",
            },
        ],
    },
    {
        image: checkMyBuilding,
        name: 'check-my-building',
        links: [
            {
                image: figmaIcon,
                value: "https://www.figma.com/design/XiL7F7s1qF1lCheckMyBuildingPreview?t=dummy",
            },
        ],
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
            },
        ]
    },
]

export default projects;