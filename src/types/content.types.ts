// Base Content interface (without relations)
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
    createdAt: string | Date;
    updatedAt: string | Date;
    managerId: string | null;
    manager?: {
        id: string;
        name: string;
        email: string;
    };
    // Optional relations (when included via include config)
    _count?: {
        reviews: number;
        tickets?: number;
        watchlist?: number;
    };
    reviews?: IReview[];
}

// Review interface
export interface IReview {
    id: string;
    rating: number;
    tags: string[];
    hasSpoiler: boolean;
    status: string;
    likesCount: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    viewerId: string;
    contentId: string;
    parentId?: string | null;
    viewer: {
        id: string;
        name: string;
        profilePhoto?: string;
    };
    _count?: {
        likes: number;
        replies?: number;
    };
    likes?: ILike[];
    replies?: IReview[];
}

// Like interface
export interface ILike {
    id: string;
    createdAt: string | Date;
    viewerId: string;
    reviewId: string;
    viewer: {
        id: string;
        name: string;
        profilePhoto?: string;
    };
}

// API Response wrapper (matches your backend)
export interface ApiResponse<TData = unknown> {
    success: boolean;
    message: string;
    data: TData;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Paginated response helper type
export type PaginatedResponse<T> = ApiResponse<T> & {
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

// Enums
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

// Payload interfaces for creating/updating
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