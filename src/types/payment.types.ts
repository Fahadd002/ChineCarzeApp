/* eslint-disable @typescript-eslint/no-explicit-any */
export enum PaymentStatus {
    PAID = "PAID",
    UNPAID = "UNPAID",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    PENDING = "PENDING"
}

export enum SubscriptionPlan {
    FREE = "FREE",
    PREMIUM_MONTHLY = "PREMIUM_MONTHLY",
    PREMIUM_YEARLY = "PREMIUM_YEARLY"
}

export interface IPayment {
    id: string;
    amount: number;
    transactionId: string;
    stripeEventId?: string;
    status: PaymentStatus;
    paymentGatewayData?: any;
    createdAt: string;
    updatedAt: string;
    purpose: string;
    viewerId: string;
    viewer: {
        id: string;
        name: string;
        email: string;
    };
    ticketId?: string;
    ticket?: {
        id: string;
        contentId: string;
        purchasedAt: string;
    };
    subscriptionId?: string;
    subscription?: {
        id: string;
        plan: SubscriptionPlan;
        startDate: string;
        endDate: string;
    };
}

export interface ICheckoutSessionPayload {
    type: "TICKET" | "SUBSCRIPTION";
    contentId?: string;
    plan?: SubscriptionPlan;
}

export interface ICheckoutSessionResponse {
    url: string;
    sessionId: string;
    ticketId?: string;
    subscriptionId?: string;
    paymentId: string;
}

export interface ISubscription {
    id: string;
    plan: SubscriptionPlan;
    amount: number;
    startDate: string;
    endDate: string;
    status: PaymentStatus;
    autoRenew: boolean;
    viewerId: string;
    viewer: {
        id: string;
        name: string;
        email: string;
    };
    payments: IPayment[];
    createdAt: string;
    updatedAt: string;
}