import type { StaticImageData } from "next/image";

import veteranam from "../../../../public/images/veteranam_image.png"
import checkMyBuilding from "../../../../public/images/check_my_building_image.png"
import livaClinicImage from "../../../../public/images/liva_clinic_image.png"

interface ProjectProps {
    name: string;
    image: StaticImageData;
}

const projects: ProjectProps[] = [
    {
        name: 'Veteranam Info',
        image: veteranam,
    },
    {
        name: 'Check My Building',
        image: checkMyBuilding,
    },
    {
        name: 'Liva Clinic',
        image: livaClinicImage,
    },
    {
        name: 'Hunger Quest',
        image: livaClinicImage,
    },
]

export default projects;