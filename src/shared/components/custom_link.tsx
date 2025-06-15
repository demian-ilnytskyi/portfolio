import LinkComponent, { type LinkProps } from 'next/link';
import {
    forwardRef,
    type ComponentProps,
    type Ref,
} from 'react';
import KTextConstants from '../constants/variables/text_constants';
import type { UrlObject } from 'url';
import { format } from 'url';
import { getLagnuageCustom } from '../localization/server';

type Url = string | UrlObject;


type NextLinkProps = Omit<ComponentProps<'a'>, keyof LinkProps> &
    Omit<LinkProps, 'locale'>;

type Props = NextLinkProps & {
    locale?: Language;
};

function CustomLinkFunction(
    { href, locale, prefetch, ...rest }: Props,
    ref: Ref<HTMLAnchorElement>
) {
    const localeValue = getLagnuageCustom();
    const curLocale = locale ?? localeValue;

    const needsLangPath = curLocale !== KTextConstants.defaultLocale || locale;

    let pathnames: Url;

    if (needsLangPath) {
        let pathname: string;
        if (typeof href === 'object') {
            pathname = format(href);
        } else {
            pathname = href;
        }
        pathnames = `/${curLocale}${pathname}`;
    } else {
        pathnames = href;
    }

    const isChangingLocale = locale != null && locale !== curLocale;

    return <LinkComponent
        ref={ref}
        href={pathnames}
        hrefLang={isChangingLocale ? locale : undefined}
        prefetch={prefetch}
        {...rest}
    />;
}

const Link = forwardRef(CustomLinkFunction);

export default Link;
