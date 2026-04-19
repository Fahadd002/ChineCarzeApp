import { ApiResponse } from "@/types/api.type";
import { IContent, IContentCreatePayload, IContentUpdatePayload, IWatchableContent } from "@/types/content.types";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getAllContents(params?: {
    page?: number;
    limit?: number;
    search?: string;
    genre?: string;
    mediaType?: string;
}): Promise<ApiResponse<IContent[]>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.genre) searchParams.set("genre", params.genre);
    if (params?.mediaType) searchParams.set("mediaType", params.mediaType);

    const queryString = searchParams.toString();
    const url = `${BASE_API_URL}/api/v1/contents${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch contents: ${res.statusText}`);
    }

    return res.json();
}

export async function getContentById(id: string): Promise<ApiResponse<IContent>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/contents/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch content: ${res.statusText}`);
    }

    return res.json();
}

export async function getWatchableContent(id: string): Promise<ApiResponse<IWatchableContent>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/contents/${id}/watch`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch watchable content: ${res.statusText}`);
    }

    return res.json();
}

export async function createContent(payload: IContentCreatePayload): Promise<ApiResponse<IContent>> {
    const formData = new FormData();

    // Add text fields
    formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);
    formData.append("releaseYear", payload.releaseYear.toString());
    if (payload.director) formData.append("director", payload.director);
    formData.append("cast", JSON.stringify(payload.cast));
    formData.append("genres", JSON.stringify(payload.genres));
    formData.append("mediaType", payload.mediaType);
    formData.append("accessType", payload.accessType);
    if (payload.ticketPrice) formData.append("ticketPrice", payload.ticketPrice.toString());

    // Add files
    if (payload.posterImage) formData.append("posterImage", payload.posterImage);
    if (payload.trailerVideo) formData.append("trailerVideo", payload.trailerVideo);
    if (payload.streamingVideo) formData.append("streamingVideo", payload.streamingVideo);

    const res = await fetch(`${BASE_API_URL}/api/v1/contents`, {
        method: "POST",
        body: formData,
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to create content: ${res.statusText}`);
    }

    return res.json();
}

export async function updateContent(payload: IContentUpdatePayload): Promise<ApiResponse<IContent>> {
    const formData = new FormData();

    // Add text fields
    if (payload.title) formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);
    if (payload.releaseYear) formData.append("releaseYear", payload.releaseYear.toString());
    if (payload.director) formData.append("director", payload.director);
    if (payload.cast) formData.append("cast", JSON.stringify(payload.cast));
    if (payload.genres) formData.append("genres", JSON.stringify(payload.genres));
    if (payload.mediaType) formData.append("mediaType", payload.mediaType);
    if (payload.accessType) formData.append("accessType", payload.accessType);
    if (payload.ticketPrice !== undefined) formData.append("ticketPrice", payload.ticketPrice.toString());

    // Add files
    if (payload.posterImage) formData.append("posterImage", payload.posterImage);
    if (payload.trailerVideo) formData.append("trailerVideo", payload.trailerVideo);
    if (payload.streamingVideo) formData.append("streamingVideo", payload.streamingVideo);

    const res = await fetch(`${BASE_API_URL}/api/v1/contents/${payload.id}`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to update content: ${res.statusText}`);
    }

    return res.json();
}

export async function deleteContent(id: string): Promise<ApiResponse<null>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/contents/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to delete content: ${res.statusText}`);
    }

    return res.json();
}

export async function getMyContents(): Promise<ApiResponse<IContent[]>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/contents/my-contents`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch my contents: ${res.statusText}`);
    }

    return res.json();
}