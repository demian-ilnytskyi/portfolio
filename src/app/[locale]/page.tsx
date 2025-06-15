import { cn } from "@/lib/utils";
import HomeImagePart from "./home_components/image_part";

export default function Home(): Component {
  return <main className="flex-1 flex flex-col">
    <HomeImagePart />
    <Divider />
  </main>

}

function Divider(): Component {
  return <div className={cn(
    "h-0.5 w-full bg-gradient-to-r from-gray-100 via-gray-400 to-gray-100 my-10",
    "dark:from-gray-800 dark:via-gray-400 dark:to-gray-800"
  )} />;
}
