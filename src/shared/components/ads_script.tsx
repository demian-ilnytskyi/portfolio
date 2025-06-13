// 'use client';
// import { useEffect } from 'react';

// const adsURL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3911943522761394';

// export default function AdsScript(): null {
//     useEffect(() => {
//         try {
//             const adsLib = document.createElement('script');
//             adsLib.src = adsURL;
//             adsLib.async = true;
//             adsLib.crossOrigin = 'anonymous';
//             document.head.appendChild(adsLib);
//         } catch (e) {
//             console.error("Add Ads Script Error: ", e);
//         }
//     }, []);

//     return null;
// }
