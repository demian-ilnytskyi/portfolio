import { createPasswordErrorsAccess } from "cloudflare-next-intl/errorsBoard";
import Secrets from "@/shared/constants/variables/secrets";

// No Firebase sign-in flow exists anywhere in this app, so
// createRequireErrorsAccess's email-allowlist gate is unsatisfiable here —
// createPasswordErrorsAccess is the shared-secret-cookie equivalent.
export const errorsAccess = createPasswordErrorsAccess({
    password: Secrets.errorsPagePassword,
});
