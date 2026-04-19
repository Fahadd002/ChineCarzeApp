import { ApiResponse } from "@/types/api.type";
import { ITicket } from "@/types/ticket.types";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getMyTickets(): Promise<ApiResponse<ITicket[]>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/tickets/my-tickets`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: ApiResponse<ITicket[]> = await res.json();
    return data;
}

export async function purchaseTicket(payload: {
    contentId: string;
    paymentMethodId: string;
}): Promise<ApiResponse<ITicket>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/tickets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: ApiResponse<ITicket> = await res.json();
    return data;
}