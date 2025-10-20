import { notFound } from "next/navigation";

export default function NotFoundFallbackPage(): Component {
    notFound();
}
