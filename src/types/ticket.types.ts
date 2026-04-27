export interface ITicket {
    id: string;
    viewerId: string;
    contentId: string;
    paymentStatus: "PENDING" | "PAID" | "FAILED" | "UNPAID";
    purchasedAt: string;
    content: {
        id: string;
        title: string;
        posterUrl?: string;
        releaseYear: number;
        mediaType: string;
        accessType: string;
        genres?: string[];
    };
    payment?: {
        id: string;
        status: "PENDING" | "PAID" | "FAILED";
        amount: number;
    };
}

export interface IPurchaseTicketPayload {
    contentId: string;
    paymentMethodId: string;
}