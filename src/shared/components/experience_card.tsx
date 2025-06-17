import { cn } from "@/lib/utils";

export interface ExperienceModel {
    title: string;
    position: string;
    period: string;
    description: string;
    skills: string[];
}

export interface ExperienceCardProps extends ExperienceModel {
    isLast: boolean;
}

const lineColors = [
    'bg-gradient-to-b from-amber-300 to-amber-700',
    'bg-gradient-to-b from-blue-300 to-blue-700',
    'bg-gradient-to-b from-green-300 to-green-700',
    'bg-gradient-to-b from-red-300 to-red-700',
    'bg-gradient-to-b from-pink-300 to-pink-700',
    'bg-gradient-to-b from-purple-300 to-purple-700',
    'bg-gradient-to-b from-gray-300 to-gray-700',
    'bg-gradient-to-b from-cyan-300 to-cyan-700',
    'bg-gradient-to-b from-teal-300 to-teal-700',
    'bg-gradient-to-b from-indigo-300 to-indigo-700',
];

export default function ExperienceCard(props: ExperienceCardProps): Component {
    const { title, position, period, description, isLast } = props;

    const getRandomTailwindColorClass = () => {
        return lineColors[Math.floor(Math.random() * lineColors.length)];
    };

    const lineColor = getRandomTailwindColorClass();

    return <li className="flex flex-col">
        <div className="flex flex-row">
            <div className={`w-1 ${lineColor} mr-4`} />
            <div className="flex flex-col">
                <h3 className="text-2xl font-bold mb-1">{title}</h3>
                <p className="text-xl font-bold mb-2 text-gray-500 dark:text-gray-400">{position}</p>
                <p className="text-sm mb-3 text-gray-500 dark:text-gray-400">{period}</p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {props.skills.map((skill, index) => (
                        <span
                            key={index}
                            className="rounded-full text-sm px-3 py-1 bg-blue-200 text-gray-600 dark:bg-blue-900 dark:text-gray-300"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
        {!isLast && <Divider />}
    </li>;
}

function Divider(): Component {
    const dividerClass = "flex-grow h-0.5 bg-gradient-to-r rounded-full";
    return <div className="flex items-center w-full my-8">
        <div className={cn(
            dividerClass,
            "from-gray-50 to-gray-300 dark:from-gray-900 dark:to-gray-600"
        )} />
        <div className={cn(
            "mx-4 relative z-10 p-4 bg-gradient-to-br dark:from-blue-900 dark:to-gray-900 rounded-full",
            "shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform",
            "duration-300 ease-in-out from-blue-200 to-white"
        )} />
        <div className={cn(
            dividerClass,
            "from-gray-300 to-gray-50 dark:from-gray-600 dark:to-gray-900"
        )} />
    </div>;
}