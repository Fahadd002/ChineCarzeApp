import { NextRequest, NextResponse } from "next/server";
import { deleteCookie } from "@/lib/cookie.utils";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function POST(request: NextRequest) {
    try {
        const cookies = request.cookies;
        const accessToken = cookies.get("accessToken")?.value;
        const refreshToken = cookies.get("refreshToken")?.value;
        const betterAuthSessionToken = cookies.get("better-auth.session_token")?.value;

        // Build auth cookie header for backend API call
        const authCookieHeader = [
            accessToken && `accessToken=${accessToken}`,
            refreshToken && `refreshToken=${refreshToken}`,
            betterAuthSessionToken && `better-auth.session_token=${betterAuthSessionToken}`,
        ]
            .filter(Boolean)
            .join("; ");

        // Call backend logout endpoint
        if (authCookieHeader) {
            const res = await fetch(`${BASE_API_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: authCookieHeader,
                },
            });

            if (!res.ok) {
                console.warn("Backend logout failed, continuing with cookie cleanup");
            }
        }

        // Clear all auth cookies in the response
        const response = NextResponse.json(
            { success: true, message: "Logged out successfully" },
            { status: 200 }
        );

        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        response.cookies.delete("better-auth.session_token");

        // Also delete server-side cookies
        await deleteCookie("accessToken");
        await deleteCookie("refreshToken");
        await deleteCookie("better-auth.session_token");

        return response;
    } catch (error) {
        console.error("Error during logout:", error);
        
        // Still try to clear cookies even if there's an error
        const response = NextResponse.json(
            { success: false, message: "Error during logout" },
            { status: 500 }
        );
        response.cookies.delete("accessToken");
        response.cookies.delete("refreshToken");
        response.cookies.delete("better-auth.session_token");

        return response;
    }
}
