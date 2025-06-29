import type { Metadata } from "next";
import KTextConstants from "@/shared/constants/variables/text_constants";
import { metadataIcons, twitter } from "@/shared/helpers/metadata_helper";

import "./globals.css";

export const metadata: Metadata = {
  twitter: twitter,
  authors: [{ name: KTextConstants.owner, url: KTextConstants.ownerUrl }],
  creator: KTextConstants.owner,
  formatDetection: { email: true, telephone: true, url: true, },
  // keywords: keywords,
  metadataBase: new URL(KTextConstants.baseUrl),
  publisher: KTextConstants.owner,
  robots: {
    follow: true,
    index: true,
  },
  verification: {
    google: '4akn_1kMaQhNznES_iNIrzNBu5a9LWquSFP_imOuLEQ',
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon"
      },
      ...metadataIcons,
    ],
    apple: [
      ...metadataIcons,
      {
        rel: 'mask-icon',
        url: "/icons/logo-512.svg",
        color: '#000000',
      }
    ],
    shortcut: [
      {
        url: "/favicon.ico",
        type: "image/x-icon"
      },
      ...metadataIcons,
    ],
  },
  applicationName: KTextConstants.appName,
  appLinks: {
    web: {
      url: KTextConstants.baseUrl,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  // const nonce = (await headers()).get('x-nonce') ?? undefined;
  return children;
}
