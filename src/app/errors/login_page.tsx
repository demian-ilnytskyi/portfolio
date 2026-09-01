"use client";

import { useRouter } from "next/navigation";
import ErrorsLoginForm from "cloudflare-next-intl/ErrorsLoginForm";
import { login } from "./actions";

export default function ErrorsLoginPage(): Component {
    const router = useRouter();
    return <ErrorsLoginForm login={login} onSuccess={() => router.refresh()} />;
}
