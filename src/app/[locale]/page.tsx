import { setPageLocaleAsync } from "@/shared/constants/variables/locale_helper";

export default async function Home({ params }: {
  params: Promise<{ locale: Language }>;
}): Promise<Component> {
  await setPageLocaleAsync(params);
  return <main className="flex-1 flex flex-col">
  </main>

}
