/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { usePathname } from "@/l18n/navigation";
// import { analytics } from "@/shared/data_provider/firebase_config_client";
// import { logEvent } from "firebase/analytics";
import { useReportWebVitals } from "next/web-vitals";
import { useEffect } from "react";

// Type for supported Web Vitals metrics
interface WebVitalMetric {
    name: "CLS" | "FCP" | "FID" | "LCP" | "TTFB" | "INP";
    value: number;
    id: string;
    rating: "good" | "needs-improvement" | "poor";
}

// Human-friendly names for metrics
const metricFriendlyNames: Record<WebVitalMetric["name"], string> = {
    CLS: "layout_shift",
    FCP: "first_content_paint",
    FID: "first_input_delay",
    LCP: "largest_content_paint",
    TTFB: "time_to_first_byte",
    INP: "interaction_to_next_paint",
};

// Format metric value (multiply CLS by 1000)
const formatMetricValue = (name: WebVitalMetric["name"], value: number): number =>
    Math.round(name === "CLS" ? value * 1000 : value);


const getScreenName = (route: string): string => {
    switch (route) {
        case '/':
            return 'Home';
        default:
            return route; // Default to URL path if no custom name is defined
    }
};

export default function CookieMetric(): Component | null {
    const path = usePathname();
    const screenPath = path.split('?')[0] || '/'; // Current path without query params
    const screenName = getScreenName(screenPath);
    // Send Web Vitals metric to Firebase Analytics
    const sendMetricToAnalytics = (metric: WebVitalMetric) => {
        // if (!analytics) return;

        // try {
        //     const friendlyName = metricFriendlyNames[metric.name];
        //     const formattedValue = formatMetricValue(metric.name, metric.value);

        //     // Log metric to console in development for debugging
        //     console.log(
        //         `[WebVitals] for Screen - ${screenName} with path - ${path}:
        //              ${friendlyName}: ${formattedValue}ms 
        //              | Rating: ${metric.rating}`
        //     );
        //     if (process.env.NODE_ENV !== "development") {
        //         // Log metric to Firebase Analytics in production
        //         logEvent(analytics, `web_${friendlyName}`, {
        //             value: formattedValue,
        //             metric_rating: metric.rating,
        //             screen_name: screenName,
        //             page_path: path,
        //         });
        //     }
        // } catch (error) {
        //     console.warn("Error logging Web Vitals to Firebase Analytics:", error);
        // }
    };

    useEffect(() => {
        // if (process.env.NODE_ENV !== "development") {
        //     if (analytics) {
        //         try {
        //             logEvent(analytics, "screen_view" as string, {
        //                 screen_name: screenName,
        //                 page_path: path,
        //             });
        //         } catch (e) {
        //             console.warn(`Screen Log Event Error: screenName: ${screenName} path: ${path} `, e);
        //         }
        //     }
        // }
    }, [path, screenName]);

    useReportWebVitals(sendMetricToAnalytics);
    return null; // No UI rendered
}
