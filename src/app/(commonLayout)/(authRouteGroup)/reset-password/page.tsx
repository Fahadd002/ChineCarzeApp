"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/services/auth.services";
import AppField from "@/components/shared/AppField";
import AppSubmitButton from "@/components/shared/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IResetPasswordPayload, resetPasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ResetPasswordPage = () => {
    const searchParams = useSearchParams();
    const emailFromUrl = decodeURIComponent(searchParams.get("email") || "");

    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IResetPasswordPayload) =>
            resetPassword(payload.email, payload.otp, payload.newPassword),
    });

    const form = useForm({
        defaultValues: {
            email: emailFromUrl,
            otp: "",
            newPassword: "",
            confirmPassword: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            setSuccessMessage(null);
            try {
                const result = await mutateAsync(value) as any;

                if (!result?.success) {
                    setServerError(result?.message || "Password reset failed");
                    return;
                }

                setSuccessMessage(result?.message || "Password has been reset successfully!");
            } catch (error: any) {
                console.error(`Password reset failed:`, error);
                const msg = error?.response?.data?.message || error?.message || "Password reset failed";
                setServerError(msg);
            }
        },
    });

    // Sync email field with URL param (only when emailFromUrl changes)
    const prevEmailRef = useRef(emailFromUrl);
    useEffect(() => {
        if (prevEmailRef.current !== emailFromUrl && emailFromUrl) {
            form.setFieldValue("email", emailFromUrl);
            prevEmailRef.current = emailFromUrl;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Card className="w-full max-w-md mx-auto shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                <CardDescription>
                    Enter the OTP sent to your email and set a new password.
                </CardDescription>
            </CardHeader>

            <CardContent>
                {successMessage ? (
                    <>
                        <Alert className="mb-4">
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                        <div className="text-center">
                            <Link href="/login" className="text-primary font-medium hover:underline">
                                Back to Login
                            </Link>
                        </div>
                    </>
                ) : (
                    <form
                        method="POST"
                        action="#"
                        noValidate
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="space-y-4"
                    >
                        <form.Field
                            name="email"
                            validators={{ onChange: resetPasswordZodSchema.shape.email }}
                        >
                            {(field) => (
                                <AppField
                                    field={field}
                                    label="Email"
                                    type="email"
                                    placeholder="Enter your email"
                                    disabled={!!emailFromUrl}
                                />
                            )}
                        </form.Field>

                        <form.Field
                            name="otp"
                            validators={{ onChange: resetPasswordZodSchema.shape.otp }}
                        >
                            {(field) => (
                                <AppField
                                    field={field}
                                    label="OTP"
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                />
                            )}
                        </form.Field>

                        <form.Field
                            name="newPassword"
                            validators={{ onChange: resetPasswordZodSchema.shape.newPassword }}
                        >
                            {(field) => (
                                <AppField
                                    field={field}
                                    label="New Password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    append={
                                        <Button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            variant="ghost"
                                            size="icon"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="size-4" aria-hidden="true" />
                                            ) : (
                                                <Eye className="size-4" aria-hidden="true" />
                                            )}
                                        </Button>
                                    }
                                />
                            )}
                        </form.Field>

                        <form.Field
                            name="confirmPassword"
                            validators={{ onChange: resetPasswordZodSchema.shape.confirmPassword }}
                        >
                            {(field) => (
                                <AppField
                                    field={field}
                                    label="Confirm Password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    append={
                                        <Button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((v) => !v)}
                                            variant="ghost"
                                            size="icon"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="size-4" aria-hidden="true" />
                                            ) : (
                                                <Eye className="size-4" aria-hidden="true" />
                                            )}
                                        </Button>
                                    }
                                />
                            )}
                        </form.Field>

                        {serverError && (
                            <Alert variant="destructive">
                                <AlertDescription>{serverError}</AlertDescription>
                            </Alert>
                        )}

                        <form.Subscribe
                            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                        >
                            {([canSubmit, isSubmitting]) => (
                                <AppSubmitButton
                                    isPending={isSubmitting || isPending}
                                    pendingLabel="Resetting Password..."
                                    disabled={!canSubmit}
                                >
                                    Reset Password
                                </AppSubmitButton>
                            )}
                        </form.Subscribe>
                    </form>
                )}
            </CardContent>

            <CardFooter className="flex justify-center">
                <Link href="/login" className="text-sm text-muted-foreground hover:underline">
                    Back to Login
                </Link>
            </CardFooter>
        </Card>
    );
};

export default ResetPasswordPage;