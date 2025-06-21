export default function LoadingIndicator(): Component {
    return <div className="flex flex-col flex-auto items-center justify-center w-full">
        <div className="animate-loading w-28 h-28 rounded-full border-[0.56rem] border-double border-neutral-variant" />
    </div>;
}
