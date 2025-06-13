"use client"

// import analyticsRepository from "@/shared/repository/analytics_repository";
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react";

const CookieMetric = dynamic(() =>
    import('./cookie_metric')
)

export default function CookieAnalyticsComponent({ state }: { state: boolean | null }): Component | null {
    const [stateValue, setState] = useState<boolean | null>(null);
    useEffect(() => {
        const updateState = async () => {
            // const value = await analyticsRepository.updateConsent(state);
            // setState(value);
        };
        updateState();
    }, [state]);
    if (stateValue === true) {
        return <CookieMetric />;
    } else {
        return null;
    }
}