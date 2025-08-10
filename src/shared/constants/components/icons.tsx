import { cn } from '@/lib/utils';
import {
    Info,
    Menu,
    Briefcase,
    Mail,
    Linkedin,
    Github,
    Users,
    ArrowLeft,
} from 'lucide-react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
};

const baseClass = 'select-none cursor-default inline-block text-2xl';

const KIcons = {
    arrowBack: (props: IconProps): Component => <ArrowLeft {...props} className={cn(baseClass, props?.className)} />,
    aboutMe: (props: IconProps): Component => <Info {...props} className={cn(baseClass, props?.className)} />,
    workExpirience: (props: IconProps): Component => <Briefcase {...props} className={cn(baseClass, props?.className)} />,
    connect: (props: IconProps): Component => <Users {...props} className={cn(baseClass, props?.className)} />,
    error: (props: IconProps): Component => <Info {...props} className={cn(baseClass, 'text-red-500', props?.className)} />,
    menu: (props: IconProps): Component => <Menu {...props} className={cn(baseClass, props?.className)} />,
    email: (props: IconProps): Component => <Mail {...props} className={cn(baseClass, props?.className)} />,
    linkedin: (props: IconProps): Component => <Linkedin {...props} className={cn(baseClass, props?.className)} />,
    github: (props: IconProps): Component => <Github {...props} className={cn(baseClass, props?.className)} />,
};

export default KIcons;