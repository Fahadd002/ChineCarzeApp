import { IPayment } from "./payment.types";

export interface ISubscription {
    id: string;
    viewerId: string;
    plan: string; // SubscriptionPlan enum value (PREMIUM_MONTHLY, PREMIUM_YEARLY)
    amount: number;
    startDate: string;
    endDate: string;
    status: "PAID" | "UNPAID" | "PENDING" | "FAILED" | "REFUNDED";
    autoRenew: boolean;
    createdAt: string;
    updatedAt: string;
    payments?: IPayment[];
}

export interface ISubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    billingCycle: "monthly" | "yearly";
    features: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateSubscriptionPayload {
    planId: string;
    paymentMethodId: string;
}

export interface ISubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    billingCycle: "monthly" | "yearly";
    features: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateSubscriptionPayload {
    planId: string;
    paymentMethodId: string;
}