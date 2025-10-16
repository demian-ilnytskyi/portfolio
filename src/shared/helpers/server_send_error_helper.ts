"use server";

import type { ErrorParams } from "../repositories/error_repository";
import errorRepository from "../repositories/error_repository";

export async function serverSendErrorReport(param: ErrorParams): Promise<void> {
    errorRepository.init();
    errorRepository.sendErrorReport({ ...param, isClient: true });
}