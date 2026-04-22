import { ApiResponse } from "@/types/api.type";
import { ICheckoutSessionPayload, IPayment, ISubscription } from "@/types/payment.types";
import { httpClient } from "@/lib/axios/httpClient";

export async function createCheckoutSession(payload: ICheckoutSessionPayload): Promise<ApiResponse<{ url: string }>> {
    return httpClient.post<{ url: string }>("/payments/checkout", payload);
}

export async function getPaymentStatus(paymentId: string): Promise<ApiResponse<IPayment>> {
    return httpClient.get<IPayment>(`/payments/${paymentId}`);
}

export async function getSubscriptionPlans(): Promise<ApiResponse<ISubscription[]>> {
    return httpClient.get<ISubscription[]>("/subscriptions/plans");
}
