/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from '@/types/api.type';
import axios from 'axios';
import { isTokenExpiringSoon } from '../token.ulits';
import { getNewTokensWithRefreshToken } from '@/services/auth.services';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if(!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined in environment variables');
}

const isBrowser = typeof window !== "undefined";

async function tryRefereshToken(accessToken: string, refereshToken: string): Promise<void> {
     if(!isTokenExpiringSoon(accessToken)){
            return;
        }
       const requestHeaders = new Headers();
       if(requestHeaders.get("x-token-refreshed") === "1"){
            return;
       }
    try {
       await getNewTokensWithRefreshToken(refereshToken);

    } catch (error: any) {
        console.error("Error refreshing token in http client:", error);
    }
}

async function getServerCookieHeader(): Promise<string> {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return cookieStore.getAll().map(cookie => `${cookie.name}=${cookie.value}`).join("; ");
}

const axiosInstance =  async  () => {
    // Browser: rely on automatic cookie handling
    if (isBrowser) {
        return axios.create({
            baseURL: API_BASE_URL,
            timeout: 30000,
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            }
        });
    }

    // Server: explicitly forward cookies to API
    const cookieHeader = await getServerCookieHeader();

    // On server we can attempt proactive refresh when we have tokens
    const accessToken = cookieHeader.match(/(?:^|;\s*)accessToken=([^;]+)/)?.[1];
    const refreshToken = cookieHeader.match(/(?:^|;\s*)refreshToken=([^;]+)/)?.[1];
    if (accessToken && refreshToken) {
        await tryRefereshToken(decodeURIComponent(accessToken), decodeURIComponent(refreshToken));
    }

    const instance = axios.create({
        baseURL : API_BASE_URL,
        timeout : 30000,
        headers:{
            'Content-Type' : 'application/json',
            'Cookie' : cookieHeader
        }
    })

    return instance;
}

export interface ApiRequestOptions {
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
}

const isFormDataPayload = (data: unknown): data is FormData => {
    return typeof FormData !== "undefined" && data instanceof FormData;
};

const resolveRequestHeaders = (data: unknown, headers?: Record<string, string>) => {
    const resolvedHeaders = { ...(headers ?? {}) };

    // Let axios/browser set multipart boundaries automatically for FormData.
    if (isFormDataPayload(data)) {
        delete resolvedHeaders["Content-Type"];
    }

    return resolvedHeaders;
};

const httpGet = async <TData> (endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {        
        const instance = await axiosInstance();
        const response = await instance.get<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {       
        console.error(`GET request to ${endpoint} failed:`, error);
        throw error;
    }
}

const httpPost = async <TData> (endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: resolveRequestHeaders(data, options?.headers),
        });
        return response.data;
    } catch (error) {
        console.error(`POST request to ${endpoint} failed:`, error);
        throw error;
    }
}

const httpPut = async <TData> (endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: resolveRequestHeaders(data, options?.headers),
        });
        return response.data;
    } catch (error) {
        console.error(`PUT request to ${endpoint} failed:`, error);
        throw error;
    }
}

const httpPatch = async <TData> (endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: resolveRequestHeaders(data, options?.headers),
        });
        return response.data;
    }
    catch (error) {
        console.error(`PATCH request to ${endpoint} failed:`, error);
        throw error;
    }
}

const httpDelete = async <TData> (endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.delete<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        console.error(`DELETE request to ${endpoint} failed:`, error);
        throw error;
    }
}

export const httpClient = {
    get: httpGet,
    post: httpPost,
    put: httpPut,
    patch: httpPatch,
    delete: httpDelete,
}