import { cn } from "@/lib/utils";

export default function CardDivider({ className }: { className?: string }): Component {
    const dividerClass = "flex-grow h-0.5 bg-gradient-to-r rounded-full";
    return <div className={cn("flex items-center w-full my-8", className)}>
        <div className={cn(
            dividerClass,
            "from-gray-50 to-gray-300 dark:from-gray-900 dark:to-gray-600"
        )} />
        <div className={cn(
            "mx-4 relative p-4 bg-gradient-to-br dark:from-blue-900 dark:to-gray-900 rounded-full",
            "shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform",
            "duration-300 ease-in-out from-blue-200 to-white"
        )} />
        <div className={cn(
            dividerClass,
            "from-gray-300 to-gray-50 dark:from-gray-600 dark:to-gray-900"
        )} />
    </div>;
}