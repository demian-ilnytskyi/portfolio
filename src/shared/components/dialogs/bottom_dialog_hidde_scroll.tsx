"use client";

import { usePathname } from "next/navigation";
// import { usePathname } from "@/l18n/navigation";
import { useEffect, useRef, useState } from "react";

export default function BottomDialogScrollHelper({ checkedBoxId }: { checkedBoxId: string }): Component {
    const [checkbox, setCheckbox] = useState<HTMLInputElement | null>(null);
    useEffect(() => {
        try {
            setCheckbox(document.getElementById(checkedBoxId) as HTMLInputElement | null);
            if (checkbox) {
                const handleCheckboxChange = () => {
                    if (checkbox.checked) {
                        document.body.style.overflow = 'hidden';
                    } else {
                        document.body.style.overflow = '';
                    }
                };

                checkbox.addEventListener('change', handleCheckboxChange);

                handleCheckboxChange();

                return () => {
                    checkbox.removeEventListener('change', handleCheckboxChange);
                    document.body.style.overflow = '';
                };
            }
        } catch (e) {
            console.warn('Bottom Dialog Hide Scroll Error ', e);
        }
    }, [checkbox, checkedBoxId]);

    return <RouterCloseDialog checkbox={checkbox} />;
}

function RouterCloseDialog({ checkbox }: { checkbox: HTMLInputElement | null }) {
    const pathname = usePathname();
    const path = useRef(pathname);

    useEffect(() => {
        if (checkbox && checkbox.checked) {
            if (path.current != pathname) {
                checkbox.checked = false;
                const event = new Event('change', { bubbles: true });
                checkbox.dispatchEvent(event);
            }
        }
        path.current = pathname;
    }, [pathname, checkbox]);

    return null;
}