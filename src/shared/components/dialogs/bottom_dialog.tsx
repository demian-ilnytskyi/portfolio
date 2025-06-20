import { cn } from "@/lib/utils";
import { type DetailedHTMLProps, type InputHTMLAttributes, useId } from "react";
import BottomDialogScrollHelper from "./bottom_dialog_hidde_scroll";

interface BottomDialogProps {
    children: React.ReactNode;
    dialogClassName?: string | undefined;
    buttonText?: string;
    buttonIcon?: Component;
    buttonClassName?: string | undefined;
    bottomButton?: (htmlFor: string, formId: string) => React.ReactNode;
    arriaLabel: string;
    checkBox?: (id: string, className: string, formId: string) => DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
}
export default function BottomDialog({
    children,
    dialogClassName,
    buttonClassName,
    buttonText,
    bottomButton: buttomButton,
    checkBox,
    buttonIcon,
    arriaLabel,
}: BottomDialogProps): Component {
    const id = useId();
    const idValue = `bottom-dialog-${id}`;
    const formIdValue = `bottom-dialog-form-${id}`;
    return <>
        {checkBox ? checkBox(idValue, "hidden peer", formIdValue) : <input type="checkbox" id={idValue} className={`hidden peer`} />}
        <BottomDialogScrollHelper checkedBoxId={idValue} />
        <label className={cn(`flex cursor-pointer self-center`, buttonClassName)} htmlFor={idValue} > {buttonIcon ?? buttonText}</label>
        <label className={`fixed hidden w-screen h-screen top-0 right-0 z-15 bg-black opacity-50 peer-checked:block`} htmlFor={idValue} />
        <dialog
            className={cn(
                "fixed flex left-1/2 transform -translate-x-1/2 dark:text-white",
                "bottom-0 w-full bg-neutral z-20 rounded-t-3xl shadow-lg",
                "max-w-200 flex-col max-h-9/10 h-full dark:bg-gray-800 bg-gray-200",
                !buttomButton && 'overflow-y-auto dialog-scrollbar text-black opacity-0',
                'transition-opacity duration-100 peer-checked:opacity-100',
                'translate-y-full ease-in-out transition-transform duration-300 peer-checked:translate-y-0',
                dialogClassName
            )}
            role="dialog"
            aria-modal="true"
            aria-label={arriaLabel}>
            {buttomButton
                ? <form method="dialog" id={formIdValue} className="flex flex-col h-full" >
                    <div className="flex-1 overflow-y-auto dialog-scrollbar p-6 pb-0">
                        {children}
                    </div>
                    <div className="sticky bottom-0 w-full bg-neutral p-4 flex justify-end">
                        {buttomButton(idValue, formIdValue)}
                    </div>
                </form>
                : children}
        </dialog>
    </>
}
