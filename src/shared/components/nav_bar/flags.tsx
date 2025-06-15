import { cn } from "@/lib/utils";

// Common classes for the flag container
const flagClass = cn(
    'min-w-10 min-h-10 bg-neutral rounded-full m-1 text-center flex flex-col',
    'overflow-clip duration-200 ease-in-out group-hover:scale-110', // Ensures content outside the rounded shape is hidden
);

// Class applied when a flag is active
const activeFlagClass = 'scale-115 group-hover:scale-110';

/**
 * UkraineFlag component displays the Ukrainian flag.
 * It consists of two horizontal stripes: blue on top and yellow on bottom.
 */
export function UkraineFlag({ isActive }: { isActive: boolean }): Component {
    return <span className={cn(
        flagClass,
        (isActive && activeFlagClass), // Apply active style if the flag is active
    )}>
        {/* Blue stripe representing the sky */}
        <div className="flex-1 bg-blue-500"></div>
        {/* Yellow stripe representing wheat fields */}
        <div className="flex-1 bg-yellow-400"></div>
    </span>;
}

/**
 * EnglishFlag component displays the Union Jack (Flag of the United Kingdom).
 * It's composed of three crosses:
 * - St. Andrew's Cross (white diagonals on a blue field)
 * - St. Patrick's Cross (red diagonals superimposed on St. Andrew's Cross)
 * - St. George's Cross (red cross on a white field, superimposed on the others)
 */
export function EnglishFlag({ isActive }: { isActive: boolean }): Component {
    return <span className={cn(
        flagClass,
        'items-center justify-center relative bg-blue-900', // Base blue background for the Union Jack
        (isActive && activeFlagClass), // Apply active style if the flag is active
    )}>
        {/* St. Andrew's Cross (White Diagonals) - Base for diagonal elements */}
        {/* These are the thicker white diagonals of the Scottish flag */}
        <div className="absolute inset-0">
            {/* Top-left to bottom-right white diagonal */}
            <div className="absolute w-full h-1.5 bg-white transform rotate-45 origin-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            {/* Top-right to bottom-left white diagonal */}
            <div className="absolute w-full h-1.5 bg-white transform -rotate-45 origin-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* St. Patrick's Cross (Red Diagonals) - These are the "small" red lines */}
        {/* To achieve the counterchanged effect (white border on red diagonals),
            we use 4 separate thin red strips, offset within the white diagonals. */}
        <div className="absolute inset-0">
            {/* First set of diagonal red lines (top-left to bottom-right part 1) */}
            <div className="absolute w-full h-0.5 bg-red-600 transform rotate-45 origin-center top-1/2 left-1/2 -translate-x-[calc(50%+0.125rem)] -translate-y-[calc(50%+0.125rem)]"></div>
            {/* First set of diagonal red lines (top-left to bottom-right part 2) */}
            <div className="absolute w-full h-0.5 bg-red-600 transform rotate-45 origin-center top-1/2 left-1/2 -translate-x-[calc(50%-0.125rem)] -translate-y-[calc(50%-0.125rem)]"></div>

            {/* Second set of diagonal red lines (top-right to bottom-left part 1) */}
            <div className="absolute w-full h-0.5 bg-red-600 transform -rotate-45 origin-center top-1/2 left-1/2 -translate-x-[calc(50%-0.125rem)] -translate-y-[calc(50%+0.125rem)]"></div>
            {/* Second set of diagonal red lines (top-right to bottom-left part 2) */}
            <div className="absolute w-full h-0.5 bg-red-600 transform -rotate-45 origin-center top-1/2 left-1/2 -translate-x-[calc(50%+0.125rem)] -translate-y-[calc(50%-0.125rem)]"></div>
        </div>

        {/* St. George's Cross (White Perpendicular) */}
        {/* Thicker white cross underneath the red one, representing the English flag's white field */}
        <div className="absolute inset-0">
            {/* Horizontal white bar */}
            <div className="absolute inset-y-1/2 left-0 right-0 h-2.5 bg-white transform -translate-y-1/2"></div>
            {/* Vertical white bar */}
            <div className="absolute inset-x-1/2 top-0 bottom-0 w-2.5 bg-white transform -translate-x-1/2"></div>
        </div>

        {/* St. George's Cross (Red Perpendicular) - These are the "big" red lines */}
        {/* Placed on top of the white perpendicular cross, representing the red cross of England */}
        <div className="absolute inset-0">
            {/* Horizontal red bar */}
            <div className="absolute inset-y-1/2 left-0 right-0 h-1.5 bg-red-600 transform -translate-y-1/2"></div>
            {/* Vertical red bar */}
            <div className="absolute inset-x-1/2 top-0 bottom-0 w-1.5 bg-red-600 transform -translate-x-1/2"></div>
        </div>
    </span>;
}