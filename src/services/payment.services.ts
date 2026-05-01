/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "@/types/api.type";
import { ICheckoutSessionPayload, ICheckoutSessionResponse, IPayment, ISubscription } from "@/types/payment.types";
import { httpClient } from "@/lib/axios/httpClient";
import { getUserInfo } from "@/services/auth.services";

export async function createCheckoutSession(payload: ICheckoutSessionPayload): Promise<ApiResponse<ICheckoutSessionResponse>> {
    // Check if user is authenticated
    const userInfo = await getUserInfo();
    if (!userInfo) {
        // Return error response that can be handled by the caller
        return {
            success: false,
            message: "User not authenticated. Please login to continue.",
            status: 401
        } as any;
    }

    return httpClient.post<ICheckoutSessionResponse>("/payments/checkout", payload);
}

export async function createSubscriptionCheckoutSession(plan: string, type: 'SUBSCRIPTION_PURCHASE' | 'SUBSCRIPTION_RENEWAL'): Promise<ApiResponse<ICheckoutSessionResponse>> {
    // Check if user is authenticated
    const userInfo = await getUserInfo();
    if (!userInfo) {
        return {
            success: false,
            message: "User not authenticated. Please login to continue.",
            status: 401
        } as any;
    }

    return httpClient.post<ICheckoutSessionResponse>("/payments/subscription-checkout", { plan, type });
}

export async function getPaymentStatus(paymentId: string): Promise<ApiResponse<IPayment>> {
    return httpClient.get<IPayment>(`/payments/${paymentId}`);
}

export async function getSubscriptionPlans(): Promise<ApiResponse<ISubscription[]>> {
    return httpClient.get<ISubscription[]>("/subscriptions/plans");
}
