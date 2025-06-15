import { cn } from "@/lib/utils";

interface CustomIconProps {
    code: number;
    // size?: number;
    color?: string;
    className?: string;
}

export default function CustomIcon({ className, code, }: CustomIconProps): Component {
    return <span
        className={cn(
            `text-2xl font-normal not-italic`,
            className
        )}
        // style={{
        //     fontSize: size,
        //     color: color,
        // }}
        aria-hidden="true"
        spellCheck="false"
    >
        {String.fromCharCode(code)}
    </span>
}
