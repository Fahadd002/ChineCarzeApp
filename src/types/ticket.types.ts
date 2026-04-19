export interface ITicket {
    id: string;
    viewerId: string;
    contentId: string;
    purchaseDate: string;
    expiryDate?: string;
    price: number;
    status: "active" | "expired" | "used";
    createdAt: string;
    updatedAt: string;
    content: {
        id: string;
        title: string;
        posterUrl?: string;
        releaseYear: number;
        mediaType: string;
    };
}

export interface IPurchaseTicketPayload {
    contentId: string;
    paymentMethodId: string;
}