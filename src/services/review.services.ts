import { ApiResponse } from "@/types/api.type";
import { ILike, IReview, IReviewCreatePayload, IReviewUpdatePayload } from "@/types/review.types";
import { httpClient } from "@/lib/axios/httpClient";

export async function getReviewsByContent(contentId: string, params?: {
    page?: number;
    limit?: number;
}): Promise<ApiResponse<IReview[]>> {
    return httpClient.get<IReview[]>(`/reviews/content/${contentId}`, {
        params,
    });
}

export async function createReview(payload: IReviewCreatePayload): Promise<ApiResponse<IReview>> {
    return httpClient.post<IReview>("/reviews", payload);
}

export async function updateReview(payload: IReviewUpdatePayload): Promise<ApiResponse<IReview>> {
    return httpClient.patch<IReview>(`/reviews/${payload.reviewId}`, {
        rating: payload.rating,
        tags: payload.tags,
        hasSpoiler: payload.hasSpoiler,
    });
}

export async function deleteReview(reviewId: string): Promise<ApiResponse<null>> {
    return httpClient.delete<null>(`/reviews/${reviewId}`);
}

export async function toggleLike(reviewId: string): Promise<ApiResponse<{ liked: boolean; likesCount: number }>> {
    return httpClient.post<{ liked: boolean; likesCount: number }>(`/reviews/${reviewId}/toggle-like`, {});
}

export async function getMyReviews(): Promise<ApiResponse<IReview[]>> {
    return httpClient.get<IReview[]>("/reviews/my-reviews");
}