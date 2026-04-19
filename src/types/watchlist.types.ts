export interface IWatchlist {
    id: string;
    viewerId: string;
    contentId: string;
    createdAt: string;
    content: {
        id: string;
        title: string;
        posterUrl?: string;
        releaseYear: number;
        genres: string[];
        mediaType: string;
    };
}

export interface IWatchlistAddPayload {
    contentId: string;
}