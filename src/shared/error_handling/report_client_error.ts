"use server";

import createServerErrorAction from "cloudflare-next-intl/createServerErrorAction";
import intlConfig from "@/l18n/intl_config";

export const reportClientError = createServerErrorAction(intlConfig);
