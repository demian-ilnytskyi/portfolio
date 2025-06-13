import { cn } from "@/lib/utils";
import { type DetailedHTMLProps, type InputHTMLAttributes, useId } from "react";
import BottomDialogScrollHelper from "./bottom_dialog_hidde_scroll";

interface BottomDialogProps {
    children: React.ReactNode;
    dialogClassName?: string | undefined;
    buttonText?: string;
    buttonIcon?: Component;
    buttonClassName?: string | undefined;
    bottomButton?: (htmlFor: string, formId: string) => React.ReactNode
    checkBox?: (id: string, className: string, formId: string) => DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
}
export default function BottomDialog({
    children,
    dialogClassName,
    buttonClassName,
    buttonText,
    bottomButton: buttomButton,
    checkBox,
    buttonIcon
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
                "fixed hidden peer-checked:flex left-1/2 transform -translate-x-1/2",
                "bottom-0 w-full bg-neutral text-secondary z-20 rounded-t-3xl shadow-lg",
                "shadow-sys-light-surface-dim",
                "shadow-lg max-w-200 border flex-col max-h-9/10 h-full",
                !buttomButton && 'overflow-y-auto dialog-scrollbar',
                dialogClassName
            )}
            role="dialog"
            aria-modal="true">
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
