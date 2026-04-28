import { ApiResponse } from "@/types/api.type";
import { ITicket } from "@/types/ticket.types";
import { ICheckoutSessionResponse } from "@/types/payment.types";
import { httpClient } from "@/lib/axios/httpClient";

export async function getMyTickets(): Promise<ApiResponse<ITicket[]>> {
    return httpClient.get<ITicket[]>("/tickets/my-tickets");
}

export async function purchaseTicket(payload: {
    contentId: string;
}): Promise<ApiResponse<ITicket>> {
    return httpClient.post<ITicket>("/tickets", payload);
}

export async function createCheckoutSession(contentId: string): Promise<ApiResponse<ICheckoutSessionResponse>> {
    return httpClient.post<ICheckoutSessionResponse>("/payments/checkout", { type: "TICKET", contentId });
}