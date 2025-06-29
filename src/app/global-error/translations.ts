class ErrorPageTranslation {
    readonly uk: Record<string, string> = {
        "title": "Щось пішло не так",
        "subtitle": "Вибачте, сталася неочікувана помилка.",
        "tryAgain": "Спробувати ще раз",
        "info": "Натискання 'Спробувати ще раз' оновить сторінку та скине налаштування сайту.",
        "support": "Якщо проблема не зникає, будь ласка,",
        "contactMe": "зверніться до мене"
    };
    readonly en: Record<string, string> = {
        "title": "Something Went Wrong",
        "subtitle": "We're sorry, an unexpected error occurred.",
        "tryAgain": "Try Again",
        "info": "Clicking 'Try Again' will refresh the page and reset site setting.",
        "support": "If the issue persists, please",
        "contactMe": "contact me"
    };
    getLocale(locale: Language): Record<string, string> {
        switch (locale) {
            case 'en':
                return this.en;
            case 'uk':
                return this.uk;
        }
    }
}

const errorPageTranslation = new ErrorPageTranslation();

export default errorPageTranslation;