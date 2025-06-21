import Markdown from 'markdown-to-jsx';
import AppTextStyle from '../constants/styles/app_text_styles';
import { cn } from '@/lib/utils';

interface MarkdownProps {
    content: string;
    className?: string;
}

export default function CustomMarkdown({ content, className }: MarkdownProps): Component {
    return <Markdown options={{ overrides: components }} className={className} >
        {content}
    </Markdown>

};
const components = {
    h1: ({ ...props }) => (
        <h1 {...props} className={AppTextStyle.h1Tablet} />
    ),
    h2: ({ ...props }) => (
        <h2 {...props} className={cn('mb-2', AppTextStyle.headlineMediumBold)} />
    ),
    h3: ({ ...props }) => (
        <h3 {...props} className={AppTextStyle.headlineSmallBold} />
    ),
    h4: ({ ...props }) => (
        <h4 {...props} className={AppTextStyle.titleLarge} />
    ),
    p: ({ ...props }) => (
        <p {...props} className={cn('mb-4', AppTextStyle.bodyLarge)} />
    ),
    strong: ({ ...props }) => (
        <strong {...props} className={AppTextStyle.bodyLargeBold} />
    ),
    ul: ({ ...props }) => (
        <ul {...props} className={cn('mb-4 pl-8', AppTextStyle.bodyLarge)} />
    ),
    ol: ({ ...props }) => (
        <ol  {...props} className={cn('mb-4 pl-8', AppTextStyle.bodyLarge)} />
    ),
    li: ({ ...props }) => (
        <li  {...props} className={AppTextStyle.bodyLarge} />
    ),
    a: ({ ...props }) => (
        <a
            target="_blank"
            rel="noopener noreferrer " {...props}
            className={'underline duration-100 ease-in-out font-bold hover:brightness-50 active:brightness-90'} />
    ),
    code: ({ ...props }) => (
        <code {...props} className={cn(AppTextStyle.bodyMedium, 'bg-neutral-variant rounded-sm')} />
    ),
};