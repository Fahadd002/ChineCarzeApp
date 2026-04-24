import { NextRequest, NextResponse } from "next/server";
import { setTokenInCookies } from "@/lib/token.ulits";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function POST(request: NextRequest) {
    try {
        const cookies = request.cookies;
        const refreshToken = cookies.get("refreshToken")?.value;
        const betterAuthSessionToken = cookies.get("better-auth.session_token")?.value;

        if (!refreshToken || !betterAuthSessionToken) {
            return NextResponse.json(
                { success: false, message: "Missing refresh token" },
                { status: 401 }
            );
        }

        const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `refreshToken=${refreshToken}; better-auth.session_token=${betterAuthSessionToken}`,
            },
        });

        if (!res.ok) {
            return NextResponse.json(
                { success: false, message: "Failed to refresh token" },
                { status: 401 }
            );
        }

        const { data } = await res.json();
        const { accessToken, refreshToken: newRefreshToken, sessionToken } = data;

        const response = NextResponse.json(
            { success: true, message: "Token refreshed successfully" },
            { status: 200 }
        );

        // Set cookies in the response
        if (accessToken) {
            await setTokenInCookies("accessToken", accessToken);
            response.cookies.set("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            });
        }

        if (newRefreshToken) {
            await setTokenInCookies("refreshToken", newRefreshToken);
            response.cookies.set("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            });
        }

        if (sessionToken) {
            await setTokenInCookies("better-auth.session_token", sessionToken, 24 * 60 * 60);
            response.cookies.set("better-auth.session_token", sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
                maxAge: 24 * 60 * 60,
            });
        }

        return response;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
