// "use client";

// import { setAnalytics } from "../data_provider/firebase_config_client";

// class AnalyticsRepository {
//     async updateConsent(state: boolean | null): Promise<boolean | null> {
//         try {
//             if (state === null) {
//                 return null;
//             }
//             if (state) {
//                 if (typeof window.gtag !== "undefined") {
//                     window.gtag("consent", "update", {
//                         ad_storage: "granted",
//                         analytics_storage: "granted",
//                         ad_user_data: "granted",
//                         ad_personalization: "granted",
//                     });
//                 }
//                 const analytics = await setAnalytics();
//                 if (analytics) {
//                     return true;
//                 } else {
//                     return false;
//                 }
//             } else {
//                 if (typeof window.gtag !== "undefined") {
//                     window.gtag("consent", "update", {
//                         ad_storage: "denied",
//                         analytics_storage: "denied",
//                         ad_user_data: "denied",
//                         ad_personalization: "denied",
//                     });
//                 }
//                 return false;
//             }
//         } catch (e) {
//             console.error('Update ConsentError: ', e);
//             return null;
//         }
//     }
// }

// const analyticsRepository = new AnalyticsRepository();

// export default analyticsRepository;