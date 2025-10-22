import { cn } from "@/lib/utils";
import AppTextStyle from "../../constants/styles/app_text_styles";
import FieldLengthCounter from "./field_length_counter";

export default function Field({
    type = "text",
    required = false,
    placeholder = "",
    className = "",
    isLong = false,
    autoComplete = true,
    name,
    tooltipText,
    maxLength,
    ...params
}: {
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
    className?: string;
    isLong?: boolean;
    rows?: number;
    onInput?: (input: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onInvalid?: (input: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    autoComplete?: boolean;
    tooltipText: string;
    maxLength?: number;
}): Component {
    const maxLengthValue = maxLength ?? (isLong ? 512 : 128);

    const properties = {
        type,
        required,
        placeholder,
        className: cn(
            AppTextStyle.bodyLarge,
            "border rounded-lg dark:bg-gray-950 dark:border-gray-600 px-3 py-2 w-full flex dark:text-white",
            "dark:focus:border-yellow-900 dark:placeholder-gray-400 text-black bg-gray-50",
            "outline-none focus:border-yellow-600 dark:hover:border-yellow-950 hover:border-yellow-700 custom-scrollbar",
            className,
        ),
        autoComplete: autoComplete ? name : "off",
        name: name,
        id: name,
        title: tooltipText,
        maxLength: maxLengthValue,
        ...params,
    };
    return <div className={cn('flex flex-col', className)}>
        <label htmlFor={name} className="mb-1 font-semibold">
            {params.label} {required && <span className="text-red-600">*</span>}
        </label>
        {isLong ? <textarea {...properties} /> : <input {...properties} />}
        <FieldLengthCounter maxLength={maxLengthValue} inputId={name} />
    </div>
}