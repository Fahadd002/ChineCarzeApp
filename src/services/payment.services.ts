import { ApiResponse } from "@/types/api.type";
import { ICheckoutSessionPayload, IPayment, ISubscription } from "@/types/payment.types";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function createCheckoutSession(payload: ICheckoutSessionPayload): Promise<ApiResponse<{ url: string }>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/payments/checkout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to create checkout session: ${res.statusText}`);
    }

    return res.json();
}

export async function getPaymentStatus(paymentId: string): Promise<ApiResponse<IPayment>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/payments/${paymentId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch payment status: ${res.statusText}`);
    }

    return res.json();
}

export async function getSubscriptionPlans(): Promise<ApiResponse<ISubscription[]>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/subscriptions/plans`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch subscription plans: ${res.statusText}`);
    }

    return res.json();
}
