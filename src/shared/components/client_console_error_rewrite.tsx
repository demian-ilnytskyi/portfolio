"use client";

import { useEffect } from "react";
import clientSendErrorReport, { initClientError } from "../helpers/error_client_helper";

export default function ClientCnsoleErrorRewrite(): null {
    useEffect(() => {
        initClientError();
        const originalConsoleError = console.error;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.error = (message?: any, ...optionalParams: any[]) => {
            clientSendErrorReport({
                classOrMethodName: 'Client Console Error Handler',
                error: message,
                optionalParams
            });
            originalConsoleError(message, ...optionalParams);
        };
    }, []);
    return null;
}