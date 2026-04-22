"use server";

import { ApiResponse } from "@/types/api.type";
import { IContentManager, ICreateContentManagerPayload, IUpdateContentManagerPayload } from "@/types/contentManager.types";
import { httpClient } from "@/lib/axios/httpClient";

export async function createContentManager(payload: ICreateContentManagerPayload): Promise<ApiResponse<IContentManager>> {
    return httpClient.post<IContentManager>("/users/create-manager", payload);
}

// Content manager APIs (some routes may not exist yet in backend).
// These functions are provided so imports compile; update endpoint paths to match your API.

export async function getContentManager(queryString = ""): Promise<ApiResponse<IContentManager[]>> {
    const endpoint = queryString ? `/content-managers?${queryString.replace(/^\?/, "")}` : "/content-managers";
    return httpClient.get<IContentManager[]>(endpoint);
}

export async function getContentManagerById(id: string): Promise<ApiResponse<IContentManager>> {
    return httpClient.get<IContentManager>(`/content-managers/${id}`);
}

export async function updateContentManager(id: string, payload: IUpdateContentManagerPayload): Promise<ApiResponse<IContentManager>> {
    return httpClient.patch<IContentManager>(`/content-managers/${id}`, payload);
}

export async function deleteContentManager(id: string): Promise<ApiResponse<{ message: string }>> {
    return httpClient.delete<{ message: string }>(`/content-managers/${id}`);
}

// Backward-compatible aliases (existing UI still uses "doctors" naming in a few places)
export const getManager = getContentManager;
export const getManagerById = getContentManagerById;
export const updateManager = updateContentManager;
export const deleteManager = deleteContentManager;
export const createManager = createContentManager;