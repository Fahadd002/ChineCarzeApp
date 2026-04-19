export interface ISubscription {
    id: string;
    viewerId: string;
    planId: string;
    startDate: string;
    endDate?: string;
    status: "active" | "cancelled" | "expired";
    autoRenew: boolean;
    createdAt: string;
    updatedAt: string;
    plan: {
        id: string;
        name: string;
        description: string;
        price: number;
        billingCycle: "monthly" | "yearly";
        features: string[];
    };
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