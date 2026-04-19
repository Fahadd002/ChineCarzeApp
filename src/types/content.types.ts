export enum MediaType {
    MOVIE = "MOVIE",
    TV_SERIES = "TV_SERIES"
}

export enum AccessType {
    FREE = "FREE",
    SUBSCRIPTION = "SUBSCRIPTION",
    TICKET = "TICKET",
    BOTH = "BOTH"
}

export interface IContent {
    id: string;
    title: string;
    description?: string;
    posterUrl?: string;
    trailerUrl?: string;
    streamingUrl?: string;
    releaseYear: number;
    director?: string;
    cast: string[];
    genres: string[];
    mediaType: MediaType;
    accessType: AccessType;
    ticketPrice?: number;
    views: number;
    createdAt: string;
    updatedAt: string;
    managerId?: string;
    manager?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface IContentCreatePayload {
    title: string;
    description?: string;
    posterImage?: File;
    trailerVideo?: File;
    streamingVideo?: File;
    releaseYear: number;
    director?: string;
    cast: string[];
    genres: string[];
    mediaType: MediaType;
    accessType: AccessType;
    ticketPrice?: number;
}

export interface IContentUpdatePayload extends Partial<IContentCreatePayload> {
    id: string;
}

export interface IWatchableContent extends IContent {
    streamingUrl: string;
}