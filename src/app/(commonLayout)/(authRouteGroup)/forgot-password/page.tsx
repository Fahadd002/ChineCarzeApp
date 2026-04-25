"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { forgotPassword } from "@/services/auth.services";
import AppField from "@/components/shared/AppField";
import AppSubmitButton from "@/components/shared/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (email: string) => forgotPassword(email),
    });

    const form = useForm({
        defaultValues: {
            email: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            
            // Validate email
            const validation = forgotPasswordZodSchema.safeParse({ email: value.email });
            if (!validation.success) {
                setServerError(validation.error.issues[0].message);
                return;
            }
            
            try {
                const result = await mutateAsync(value.email) as any;

                if (!result?.success) {
                    const errorMsg = result?.message || "Failed to send OTP";
                    setServerError(errorMsg);
                    toast.error(errorMsg);
                    return;
                }

                toast.success(result?.message || "Password reset OTP has been sent to your email.");
                router.push(`/reset-password?email=${encodeURIComponent(value.email)}`);
                
            } catch (error: any) {
                console.error(`Forgot password failed:`, error);
                const msg = error?.response?.data?.message || error?.message || "Failed to send OTP";
                setServerError(msg);
                toast.error(msg);
            }
        },
    });

    return (
        <Card className="w-full max-w-md mx-auto shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                <CardDescription>
                    Enter your email address and we&apos;ll send you an OTP to reset your password.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <form.Field name="email">
                        {(field) => (
                            <AppField
                                field={field}
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                                disabled={isPending}
                            />
                        )}
                    </form.Field>

                    {serverError && (
                        <Alert variant="destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <AppSubmitButton
                        isPending={isPending}
                        pendingLabel="Sending OTP..."
                    >
                        Send OTP
                    </AppSubmitButton>
                </form>
            </CardContent>

            <CardFooter className="flex justify-center">
                <Link href="/login" className="text-sm text-muted-foreground hover:underline">
                    Back to Login
                </Link>
            </CardFooter>
        </Card>
    );
};

export default ForgotPasswordPage;