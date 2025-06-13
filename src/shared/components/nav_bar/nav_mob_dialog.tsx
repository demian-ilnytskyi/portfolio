import KIcons from "../../constants/components/icons";
import BottomDialog from "../dialogs/bottom_dialog";

export default function NavigationMobDialog({ children }: { children: React.ReactNode; }): Component {
    return <BottomDialog
        buttonClassName="tablet:hidden flex"
        buttonIcon={<div className="bg-secondary p-3 rounded-full">
            < KIcons.menu className="cursor-pointer text-white" />
        </div>}
        dialogClassName="h-max flex-col items-start self-end pb-5 pl-5">
        {children}
    </BottomDialog>
}