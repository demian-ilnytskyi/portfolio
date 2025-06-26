import { cn } from "optimized-next-intl";
import AppTextStyle from "../constants/styles/app_text_styles";

export default function Field({
    label,
    name,
    type = "text",
    required = false,
    placeholder = "",
    className = "",
    isLong = false,
    rows,
    onInput,
    onInvalid,
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
}): Component {
    const properties = {
        type,
        name,
        required,
        placeholder,
        className: cn(
            "border rounded-lg dark:bg-gray-950 dark:border-gray-600 px-3 py-2 w-full flex dark:text-white",
            "dark:focus:border-yellow-900 dark:placeholder-gray-400 text-black bg-gray-50 focus:bg-gray-10",
            "outline-none focus:border-yellow-600 dark:hover:border-yellow-950 hover:border-yellow-700",
            AppTextStyle.bodyLarge,
        ),
        rows,
        onInput,
        onInvalid,
    };
    return <div className={`flex flex-col ${className}`}>
        <label className="mb-1 font-semibold">
            {label} {required && <span className="text-red-600">*</span>}
        </label>
        {isLong ? <textarea {...properties} /> : <input {...properties} />}
    </div>
}