import { ApiResponse } from "@/types/api.type";
import { IWatchlist, IWatchlistAddPayload } from "@/types/watchlist.types";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getMyWatchlist(): Promise<ApiResponse<IWatchlist[]>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/watchlist`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch watchlist: ${res.statusText}`);
    }

    return res.json();
}

export async function addToWatchlist(payload: IWatchlistAddPayload): Promise<ApiResponse<IWatchlist>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/watchlist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to add to watchlist: ${res.statusText}`);
    }

    return res.json();
}

export async function removeFromWatchlist(contentId: string): Promise<ApiResponse<null>> {
    const res = await fetch(`${BASE_API_URL}/api/v1/watchlist/${contentId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to remove from watchlist: ${res.statusText}`);
    }

    return res.json();
}