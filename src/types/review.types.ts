export enum ReviewStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export interface IReview {
    id: string;
    rating: number;
    tags: string[];
    hasSpoiler: boolean;
    status: ReviewStatus;
    likesCount: number;
    createdAt: string;
    updatedAt: string;
    viewerId: string;
    viewer: {
        id: string;
        name: string;
        email: string;
        profilePhoto?: string;
    };
    contentId: string;
    content: {
        id: string;
        title: string;
        posterUrl?: string;
    };
    parentId?: string;
    parent?: IReview;
    replies?: IReview[];
    likes?: ILike[];
}

export interface IReviewCreatePayload {
    contentId: string;
    rating: number;
    tags: string[];
    hasSpoiler: boolean;
}

export interface IReviewUpdatePayload {
    reviewId: string;
    rating?: number;
    tags?: string[];
    hasSpoiler?: boolean;
}

export interface ILike {
    id: string;
    createdAt: string;
    viewerId: string;
    reviewId: string;
}