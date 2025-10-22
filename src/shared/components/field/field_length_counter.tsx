'use client'

import { useEffect, useState } from "react";

export default function FieldLengthCounter({
    inputId,
    maxLength,
}: {
    maxLength: number;
    inputId: string
}): Component {
    const [count, setCount] = useState(0);


    useEffect(() => {
        const input = document.getElementById(inputId) as
            | HTMLInputElement
            | HTMLTextAreaElement
            | null;

        if (!input) return;

        const handleInput = () => {
            setCount(input.value.length);
        };

        input.addEventListener("input", handleInput);

        // Initialize counter in case input has prefilled value
        setCount(input.value.length);

        return () => {
            input.removeEventListener("input", handleInput);
        };
    }, [inputId]);


    return <div className="text-right text-gray-500 mt-1 select-none text-xs dark:text-gray-400">
        {count} / {maxLength}
    </div>;
}
