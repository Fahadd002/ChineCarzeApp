"use server";

import { ApiResponse } from "@/types/api.type";
import { IContentManager, ICreateContentManagerPayload, IUpdateContentManagerPayload } from "@/types/contentManager.types";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function createContentManager(payload: ICreateContentManagerPayload): Promise<ApiResponse<IContentManager>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/users/create-manager`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to create content manager: ${res.statusText}`);
    }

    return res.json();
}

// Note: Other content manager functions like get, update, delete can be added when the backend provides the routes

export const getDoctorById = async (id: string) => {
    try {
        const doctor = await httpClient.get<IDoctorDetails>(`/doctors/${id}`);
        return doctor;
    } catch (error) {
        console.log("Error fetching doctor by id:", error);
        throw error;
    }
}