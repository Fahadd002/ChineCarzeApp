import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.type";
import { IContent, IContentCreatePayload, IContentUpdatePayload, IWatchableContent } from "@/types/content.types";

export async function getAllContents(params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    genre?: string;
    mediaType?: string;
    releaseYear?: number;
    accessType?: string;
}): Promise<ApiResponse<IContent[]>> {
    const queryString = new URLSearchParams();
    
    if (params?.page) queryString.set("page", params.page.toString());
    if (params?.limit) queryString.set("limit", params.limit.toString());
    if (params?.searchTerm) queryString.set("searchTerm", params.searchTerm);
    if (params?.sortBy) queryString.set("sortBy", params.sortBy);
    if (params?.sortOrder) queryString.set("sortOrder", params.sortOrder);
    if (params?.genre) queryString.set("genre", params.genre);
    if (params?.mediaType) queryString.set("mediaType", params.mediaType);
    if (params?.releaseYear) queryString.set("releaseYear", params.releaseYear.toString());
    if (params?.accessType) queryString.set("accessType", params.accessType);
    
    const query = queryString.toString();
    const url = `/contents${query ? `?${query}` : ""}`;
    
    return httpClient.get(url);
}

export async function getContentById(id: string): Promise<ApiResponse<IContent>> {
    return httpClient.get(`/contents/${id}`);
}

export async function getWatchableContent(id: string): Promise<ApiResponse<IWatchableContent>> {
    return httpClient.get(`/contents/${id}/watch`);
}

export async function createContent(payload: IContentCreatePayload): Promise<ApiResponse<IContent>> {
    const formData = new FormData();

    formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);
    if (payload.trailerVideo) formData.append("trailerUrl", payload.trailerVideo);
    if (payload.streamingVideo) formData.append("streamingUrl", payload.streamingVideo);
    formData.append("releaseYear", payload.releaseYear.toString());
    if (payload.director) formData.append("director", payload.director);
    formData.append("cast", JSON.stringify(payload.cast));
    formData.append("genres", JSON.stringify(payload.genres));
    formData.append("mediaType", payload.mediaType);
    formData.append("accessType", payload.accessType);
    if (payload.ticketPrice) formData.append("ticketPrice", payload.ticketPrice.toString());

    if (payload.posterImage) formData.append("posterImage", payload.posterImage);

    return httpClient.post("/contents", formData);
}

export async function updateContent(payload: IContentUpdatePayload): Promise<ApiResponse<IContent>> {
    const formData = new FormData();

    if (payload.title) formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);
    if (payload.trailerVideo) formData.append("trailerUrl", payload.trailerVideo);
    if (payload.streamingVideo) formData.append("streamingUrl", payload.streamingVideo);
    if (payload.releaseYear) formData.append("releaseYear", payload.releaseYear.toString());
    if (payload.director) formData.append("director", payload.director);
    if (payload.cast) formData.append("cast", JSON.stringify(payload.cast));
    if (payload.genres) formData.append("genres", JSON.stringify(payload.genres));
    if (payload.mediaType) formData.append("mediaType", payload.mediaType);
    if (payload.accessType) formData.append("accessType", payload.accessType);
    if (payload.ticketPrice !== undefined) formData.append("ticketPrice", payload.ticketPrice.toString());

    if (payload.posterImage) formData.append("posterImage", payload.posterImage);

    return httpClient.patch(`/contents/${payload.id}`, formData);
}

export async function deleteContent(id: string): Promise<ApiResponse<null>> {
    return httpClient.delete(`/contents/${id}`);
}

export async function getMyContents(): Promise<ApiResponse<IContent[]>> {
    return httpClient.get("/contents/my-contents");
}

export async function checkContentAccess(id: string): Promise<ApiResponse<{ canAccess: boolean }>> {
    return httpClient.get(`/contents/${id}/access`);
}
