
"use server";

import { localeCookieName } from "@/l18n/routing";
import { cookies } from "next/headers";

export default async function languageSwitchFunction(value: Language): Promise<void> {
    try {
        (await cookies()).set(localeCookieName, value, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
    } catch (e) {
        console.error(`Set Language Cookie Error with value: ${value}`, e);
    }
}