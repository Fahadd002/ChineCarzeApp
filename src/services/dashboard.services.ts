"use server";

import { ApiResponse } from "@/types/api.type";
import { IAdminDashboardData } from "@/types/dashboard.types";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function getDashboardData(): Promise<ApiResponse<IAdminDashboardData>> {
    try {
        const res = await fetch(`${BASE_API_URL}/api/v1/stats`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch dashboard data: ${res.statusText}`);
        }

        return res.json();
    } catch (error: any) {
        console.log(error, "From Dashboard Server Action");
        return {
            success: false,
            message: error.message || "An error occurred while fetching dashboard data.",
            data: null,
        };
    }
}