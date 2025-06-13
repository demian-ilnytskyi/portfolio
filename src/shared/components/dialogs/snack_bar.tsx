import { cn } from "@/lib/utils";

interface SnackBarProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    open?: boolean;
    ariaLabelledby?: string;
}

export default function SnackBar({ className, ...props }: SnackBarProps): Component {
    return <dialog
        className={cn("fixed bottom-0 w-full bg-secondary text-neutral z-20 flex justify-center items-center", className)}
        role="dialog"
        aria-modal="false"
        {...props} />

}
