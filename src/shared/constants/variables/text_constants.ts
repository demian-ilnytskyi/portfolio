export default abstract class KTextConstants {
    static readonly isDevENV = process.env.NEXT_PUBLIC_FLAVOUR === "development";
    static readonly isDev = process.env.NODE_ENV === "development";
    static readonly currentDate = new Date();
    static readonly owner = "Demian Ilnutskyi";
    static readonly appName = "Demian Portfolio";
    static readonly ownerUrl = "https://portfolio.demien-ilnutskiy.workers.dev";
    static readonly defaultLocale: Language = "en";
    static readonly locales: Language[] = ["uk", "en"];
    static readonly localesSet = new Set(KTextConstants.locales);
    static readonly ownerEmail = "demian.ilnutskyi@gmail.com";
    static readonly ownerLinkedIn = "https://www.linkedin.com/in/demian-ilnytskyi-54367a268";
    static readonly ownerGitHub = "https://github.com/DemienIlnutskiy";
    static readonly projectGitHubLink = KTextConstants.ownerGitHub + '/portfolio';
    static readonly currentCompany = 'Coding House Studio LLC';
    static readonly baseUrl =
        KTextConstants.isDev
            ? "http://localhost:3000"
            : KTextConstants.isDevENV
                ? "https://portfolio-development.demien-ilnutskiy.workers.dev"
                : "https://portfolio.demien-ilnutskiy.workers.dev";
    static readonly profileImageUrl = `${KTextConstants.baseUrl}/images/profile.png`;
}