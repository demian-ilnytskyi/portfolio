"use client";

import { useEffect, useState } from "react";

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

    useEffect(() => {
        function handleHashChange() {
            if (checkbox && checkbox.checked) {
                checkbox!.checked = false;
                const event = new Event('change', { bubbles: true });
                checkbox!.dispatchEvent(event);
            }
        }
        window.addEventListener('scrollend', handleHashChange);
        return () => {
            window.removeEventListener('scrollend', handleHashChange);
        };
    }, [checkbox]);

    return null;
}