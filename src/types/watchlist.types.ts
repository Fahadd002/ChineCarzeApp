import { IContent } from "./content.types";

export interface IWatchlist {
    id: string;
    viewerId: string;
    contentId: string;
    createdAt: string;
    content: IContent;
}

export interface IWatchlistAddPayload {
    contentId: string;
}