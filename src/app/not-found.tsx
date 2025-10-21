import type { Metadata } from "next";
import { getLocale } from "optimized-next-intl";
import NotFound, { generateMetadata as notFoundGenerateMetadata } from "./[locale]/not-found";
import RootLayout from "./[locale]/layout";
import KTextConstants from "@/shared/constants/variables/text_constants";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata | null> {
  if (KTextConstants.isBuild) return null;
  const locale = await getLocale() as Language;
  return notFoundGenerateMetadata({ params: Promise.resolve({ locale }) });
};

export default async function GlobalNotFound(): Promise<Component | null> {
  if (KTextConstants.isBuild) return null;
  const locale = await getLocale() as Language;
  return <RootLayout params={Promise.resolve({ locale })}>
    <NotFound params={Promise.resolve({ locale })} />
  </RootLayout>
}
