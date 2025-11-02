export default abstract class KTextConstants {
    static readonly isBuild = process.env.IS_BUILDING;
    static readonly flavour = process.env.NEXT_PUBLIC_FLAVOUR;
    static readonly isDevENV = KTextConstants.flavour === "development";
    static readonly isDev = process.env.NODE_ENV === "development";
    static readonly buildDate = new Date();
    static readonly owner = "Demian Ilnytskyi";
    static readonly appName = "Demian Portfolio";
    static readonly ownerUrl = "https://demian.inflalite.com";
    static readonly defaultLocale: Language = "en";
    static readonly locales: Language[] = ["uk", "en"];
    static readonly ownerEmail = "demian.ilnytskyi@gmail.com";
    static readonly ownerLinkedIn = "https://www.linkedin.com/in/demian-ilnytskyi";
    static readonly ownerGitHub = "https://github.com/demian-ilnytskyi";
    static readonly projectGitHubLink = KTextConstants.ownerGitHub + '/portfolio';
    static readonly currentCompany = '';
    static readonly baseUrl =
        KTextConstants.isDev
            ? "http://localhost:3000"
            : KTextConstants.isDevENV
                ? "https://dev.demian.inflalite.com"
                : "https://demian.inflalite.com";
    static readonly profileImageUrl = `${KTextConstants.baseUrl}/images/profile.png`;
}
