import { ApiResponse } from "@/types/api.type";
import { ILike, IReview, IReviewCreatePayload, IReviewUpdatePayload } from "@/types/review.types";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getReviewsByContent(contentId: string, params?: {
    page?: number;
    limit?: number;
}): Promise<ApiResponse<IReview[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const queryString = searchParams.toString();
    const url = `${BASE_API_URL}/api/v1/reviews/content/${contentId}${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch reviews: ${res.statusText}`);
    }

    return res.json();
}

export async function createReview(payload: IReviewCreatePayload): Promise<ApiResponse<IReview>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to create review: ${res.statusText}`);
    }

    return res.json();
}

export async function updateReview(payload: IReviewUpdatePayload): Promise<ApiResponse<IReview>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/reviews/${payload.reviewId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            rating: payload.rating,
            tags: payload.tags,
            hasSpoiler: payload.hasSpoiler,
        }),
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to update review: ${res.statusText}`);
    }

    return res.json();
}

export async function deleteReview(reviewId: string): Promise<ApiResponse<null>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to delete review: ${res.statusText}`);
    }

    return res.json();
}

export async function toggleLike(reviewId: string): Promise<ApiResponse<{ liked: boolean; likesCount: number }>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/reviews/${reviewId}/toggle-like`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to toggle like: ${res.statusText}`);
    }

    return res.json();
}

export async function getMyReviews(): Promise<ApiResponse<IReview[]>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/reviews/my-reviews`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch my reviews: ${res.statusText}`);
    }

    return res.json();
}