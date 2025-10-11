import { localeCookieName } from "optimized-next-intl";
import KTextConstants from "../constants/variables/text_constants";

export default function TestScript(): Component {
    return <script
        id="detect-theme-script"
        dangerouslySetInnerHTML={{
            __html: `
      (function() {
            console.log('START');
            const cookies = document.cookie.split('; ');
            let locale;
            for (let i = 0; i < cookies.length; i++) {
                const [key, value] = cookies[i].split('=');
                if (key === "${localeCookieName}") {
                    locale = decodeURIComponent(value);
                    break;
                }
            }
            console.log('LOCALE'locale);
            if(locale==${KTextConstants.defaultLocale}) return;
            const pathname = window.location.pathname;
            console.log('dsffdsdsf ',locale,pathname);
            if(pathname.startsWith('/'+locale)) return;
            window.location.href = '/'+locale+pathname;
      })();
    `,
        }}
    />;
}