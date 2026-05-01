/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "@/types/api.type";
import { ITicket } from "@/types/ticket.types";
import { ICheckoutSessionResponse } from "@/types/payment.types";
import { httpClient } from "@/lib/axios/httpClient";
import { getUserInfo } from "@/services/auth.services";

export async function getMyTickets(): Promise<ApiResponse<ITicket[]>> {
    return httpClient.get<ITicket[]>("/tickets/my-tickets");
}

export async function purchaseTicket(payload: {
    contentId: string;
}): Promise<ApiResponse<ITicket>> {
    return httpClient.post<ITicket>("/tickets", payload);
}

export async function createCheckoutSession(contentId: string): Promise<ApiResponse<ICheckoutSessionResponse>> {

    const userInfo = await getUserInfo();
    if (!userInfo) {
        // Return error response that can be handled by the caller
        return {
            success: false,
            message: "User not authenticated. Please login to continue.",
            status: 401
        } as any;
    }

    return httpClient.post<ICheckoutSessionResponse>("/payments/checkout", { type: "TICKET", contentId });
}