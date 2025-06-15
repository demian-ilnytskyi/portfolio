export default abstract class AppTextStyle {
    // Hint Styles
    static readonly textHint16: string = 'text-base font-normal text-neutral-variant'; // 16px = 1rem
    static readonly textHint20: string = 'text-xl font-normal text-neutral-variant'; // 20px = 1.25rem
    static readonly textHint24: string = 'text-2xl font-normal text-neutral-variant'; // 24px = 1.5rem
    static readonly textHint14: string = 'text-sm font-normal text-neutral-variant'; // 14px = 0.875rem

    // Error Styles
    static readonly textError14: string = 'text-sm font-normal text-ref-error-50'; // 14px = 0.875rem

    // Material Theme Headline Styles
    static readonly headlineLarge: string = 'text-3xl font-medium leading-tight'; // 32px = 2rem
    static readonly headlineLargeBold: string = 'text-3xl font-bold leading-tight'; // 32px = 2rem
    static readonly headlineMedium: string = 'text-3xl font-medium leading-snug'; // 28px = 1.75rem
    static readonly headlineMediumBold: string = 'text-3xl font-bold leading-snug'; // 28px = 1.75rem
    static readonly headlineSmall: string = 'text-2xl font-medium leading-normal'; // 24px = 1.5rem
    static readonly headlineSmallBold: string = 'text-2xl font-bold leading-normal'; // 24px = 1.5rem
    static readonly headlineSmallVariant: string = 'text-2xl font-medium text-neutral-variant leading-normal'; // 24px = 1.5rem

    // Material Theme Body Styles
    static readonly bodyLarge: string = 'text-base font-normal leading-relaxed tracking-wide'; // 16px = 1rem
    static readonly bodyLargeBold: string = 'text-base font-bold leading-relaxed tracking-wide'; // 16px = 1rem
    static readonly bodyMedium: string = 'text-sm font-normal leading-normal tracking-tight'; // 14px = 0.875rem
    static readonly bodyMediumBold: string = 'text-sm font-bold leading-normal tracking-tight'; // 14px = 0.875rem
    static readonly bodySmall: string = 'text-xs font-normal leading-normal tracking-tight'; // 12px = 0.75rem

    // Material Theme Label Styles
    static readonly labelLarge: string = 'text-sm font-medium leading-normal tracking-tight'; // 14px = 0.875rem
    static readonly labelMedium: string = 'text-xs font-medium leading-normal tracking-tight'; // 12px = 0.75rem
    static readonly labelSmall: string = 'text-xs font-medium leading-normal tracking-tight'; // 11px = 0.6875rem

    // Material Theme Title Styles
    static readonly titleLarge: string = 'text-2xl font-normal leading-normal'; // 22px = 1.375rem
    static readonly titleLargeBold: string = 'text-2xl font-bold leading-normal'; // 22px = 1.375rem
    static readonly titleMedium: string = 'text-base font-medium leading-relaxed tracking-tight'; // 16px = 1rem
    static readonly titleMediumBold: string = 'text-base font-bold leading-relaxed tracking-tight'; // 16px = 1rem
    static readonly titleSmall: string = 'text-sm font-medium leading-normal tracking-tight'; // 14px = 0.875rem

    // Heading Styles
    static readonly h1: string = 'text-6xl font-medium leading-none tracking-tight'; // 64px = 4rem
    static readonly h1Mob: string = 'text-4xl font-medium leading-tight'; // 36px = 2.25rem
    static readonly h1Tablet: string = 'text-5xl font-medium leading-snug tracking-tight'; // 48px = 3rem
    static readonly h1TabletBold: string = 'text-5xl font-bold leading-snug tracking-tight'; // 48px = 3rem
}