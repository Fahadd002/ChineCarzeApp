import { ApiResponse } from "@/types/api.type";
import { ISubscription } from "@/types/subscription.types";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getMySubscriptions(): Promise<ApiResponse<ISubscription[]>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/subscriptions/my-subscriptions`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: ApiResponse<ISubscription[]> = await res.json();
    return data;
}

export async function createSubscription(payload: {
    planId: string;
    paymentMethodId: string;
}): Promise<ApiResponse<ISubscription>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/subscriptions`, {
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

    const data: ApiResponse<ISubscription> = await res.json();
    return data;
}

export async function cancelSubscription(subscriptionId: string): Promise<ApiResponse<null>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/subscriptions/${subscriptionId}/cancel`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: ApiResponse<null> = await res.json();
    return data;
}