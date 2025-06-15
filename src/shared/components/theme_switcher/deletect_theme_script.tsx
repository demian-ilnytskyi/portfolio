import KTextConstants from "@/shared/constants/variables/text_constants";
import CookieKey from "../../constants/variables/cookie_key";

export default function DeletectThemeScript(): Component {
    return <script
        id="detect-theme-script"
        dangerouslySetInnerHTML={{
            __html: `
      (function() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
        document.cookie = '${CookieKey.isDarkCookieKey}=' +
                            prefersDark +
                            '; path=/; max-age=31536000; SameSite=Lax;'
                            ${KTextConstants.isDev ? '' : ' + "Secure;"'}
                            ;
      })();
    `,
        }}
    />;
}