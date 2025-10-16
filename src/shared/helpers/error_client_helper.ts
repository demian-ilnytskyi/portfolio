"use client";

import errorRepository, { type ErrorParams } from "../repositories/error_repository";
import { serverSendErrorReport } from "./server_send_error_helper";

let lastError: unknown = null;
let errorCount = 0;

export function initClientError(): void {
    errorCount = 0;
    lastError = null
}

export default function clientSendErrorReport(param: ErrorParams): void {
    try {
        if (typeof param.error === 'function') {
            const error = errorRepository.resolveFunctionError(param.error);
            param.error = error;
        }
        if (errorCount > 3) {
            return;
        }
        if (lastError == param.error) {
            return;
        }
        errorCount++;
        lastError = param.error;
        serverSendErrorReport(param);
    } catch (e) {
        console.warn(`Error handling Error: ${e}`);
    }
}