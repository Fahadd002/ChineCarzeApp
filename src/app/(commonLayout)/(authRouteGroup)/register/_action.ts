/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.type";
import { IRegisterResponse } from "@/types/auth.type";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const registerAction = async (payload : IRegisterPayload) : Promise<IRegisterResponse | ApiErrorResponse> =>{
    const parsedPayload = registerZodSchema.safeParse(payload);

    if(!parsedPayload.success){
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        }
    }
    try {
        const response = await httpClient.post<IRegisterResponse>("/auth/register", parsedPayload.data);

        // After successful registration, redirect to login or verification
        redirect("/login?message=Registration successful. Please check your email for verification.");
        
    } catch (error : any) {
        console.log(error, "error");
        if(error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")){
            throw error;
        }

        return {
            success: false,
            message: error?.response?.data?.message || "Registration failed",
        }
    }
}