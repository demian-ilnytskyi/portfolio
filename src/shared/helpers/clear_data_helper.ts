"use server";

import { cookies } from "next/headers";
import KTextConstants from "../constants/variables/text_constants";

export default async function clearCookiesAndCache(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });

  // Set Cookie value for no store cache 2 minutes
  cookieStore.set(KTextConstants.clearCacheCookieKey, 'true', {
    path: '/',
    maxAge: 120,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
}