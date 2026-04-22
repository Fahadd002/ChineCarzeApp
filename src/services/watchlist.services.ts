import { ApiResponse } from "@/types/api.type";
import { IWatchlist, IWatchlistAddPayload } from "@/types/watchlist.types";
import { httpClient } from "@/lib/axios/httpClient";

export async function getMyWatchlist(): Promise<ApiResponse<IWatchlist[]>> {
    return httpClient.get<IWatchlist[]>("/watchlist");
}

export async function addToWatchlist(payload: IWatchlistAddPayload): Promise<ApiResponse<IWatchlist>> {
    return httpClient.post<IWatchlist>("/watchlist", payload);
}

export async function removeFromWatchlist(contentId: string): Promise<ApiResponse<null>> {
    return httpClient.delete<null>(`/watchlist/${contentId}`);
}