import { cn } from "@/lib/utils";

export default function Divider({ id }: { id?: string }): Component {
    return <>
        {id && <div id={id} />}
        <div
            className={cn(
                "h-0.5 w-full bg-gradient-to-r from-gray-100 via-gray-400 to-gray-100 my-10",
                "dark:from-gray-800 dark:via-gray-400 dark:to-gray-800"
            )} />
    </>;
}