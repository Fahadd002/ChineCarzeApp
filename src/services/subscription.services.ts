import { ApiResponse } from "@/types/api.type";
import { ISubscription } from "@/types/subscription.types";
import { httpClient } from "@/lib/axios/httpClient";

export async function getMySubscriptions(): Promise<ApiResponse<ISubscription[]>> {
    return httpClient.get<ISubscription[]>("/subscriptions/my-subscriptions");
}

export async function createSubscription(payload: {
    planId: string;
    paymentMethodId: string;
}): Promise<ApiResponse<ISubscription>> {
    return httpClient.post<ISubscription>("/subscriptions", payload);
}

export async function cancelSubscription(subscriptionId: string): Promise<ApiResponse<null>> {
    return httpClient.patch<null>(`/subscriptions/${subscriptionId}/cancel`, {});
}