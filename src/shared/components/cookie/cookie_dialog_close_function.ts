
"use server";

import KTextConstants from "@/shared/constants/variables/text_constants";
import { cookies } from "next/headers";

export default async function closeDialog(value: boolean): Promise<void> {
    try {
        (await cookies()).set(KTextConstants.analyticsCookieKey, value.toString(), {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
    } catch (e) {
        console.error(`Close Cookie Dialog Error: value: ${value}`, e);
    }
}