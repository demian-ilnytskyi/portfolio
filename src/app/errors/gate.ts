import { cookies } from "next/headers";
import Secrets from "@/shared/constants/variables/secrets";

const COOKIE_NAME = "errors_auth";

async function sha256Hex(input: string): Promise<string> {
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

async function expectedCookieValue(): Promise<string> {
    return sha256Hex(Secrets.errorsPagePassword);
}

export async function hasErrorsAccess(): Promise<boolean> {
    const store = await cookies();
    const value = store.get(COOKIE_NAME)?.value;
    if (!value) return false;
    return value === (await expectedCookieValue());
}

export async function verifyErrorsPassword(password: string): Promise<boolean> {
    return password === Secrets.errorsPagePassword;
}

export async function setErrorsAuthCookie(): Promise<void> {
    const store = await cookies();
    store.set(COOKIE_NAME, await expectedCookieValue(), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/errors",
        maxAge: 60 * 60 * 24 * 30,
    });
}
