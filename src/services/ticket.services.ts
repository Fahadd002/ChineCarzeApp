import { ApiResponse } from "@/types/api.type";
import { ITicket } from "@/types/ticket.types";
import { httpClient } from "@/lib/axios/httpClient";

export async function getMyTickets(): Promise<ApiResponse<ITicket[]>> {
    return httpClient.get<ITicket[]>("/tickets/my-tickets");
}

export async function purchaseTicket(payload: {
    contentId: string;
    paymentMethodId: string;
}): Promise<ApiResponse<ITicket>> {
    return httpClient.post<ITicket>("/tickets", payload);
}