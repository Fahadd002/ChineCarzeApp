"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyEmailAction } from "@/app/(commonLayout)/(authRouteGroup)/verify-email/_action";
import AppField from "@/components/shared/AppField";
import AppSubmitButton from "@/components/shared/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IVerifyEmailPayload, verifyEmailZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface VerifyEmailFormProps {
    email: string;
}

const VerifyEmailForm = ({ email }: VerifyEmailFormProps) => {
    const [serverError, setServerError] = useState<string | null>(null);

    const router = useRouter();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IVerifyEmailPayload) => verifyEmailAction(payload),
    });

    const form = useForm({
        defaultValues: {
            email: email,
            otp: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                const result = await mutateAsync(value) as any;

                if (!result?.success) {
                    const msg = result?.message || result?.data?.message || "Verification failed";
                    setServerError(msg);
                    toast.error(msg);
                    return;
                }

                // success
                const successMessage = result.message || "Email verified successfully.";
                toast.success(successMessage);
            } catch (error: any) {
                console.log(`Verification failed:`, error);
                const msg = error?.response?.data?.message || error?.message || "Verification failed";
                setServerError(msg);
                toast.error(msg);
            }
        }
    });

    return (
        <Card className="w-full max-w-md mx-auto shadow-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Verify Email</CardTitle>
                <CardDescription>
                    Enter the OTP sent to your email to verify your account.
                </CardDescription>
            </CardHeader>

            <CardContent>
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
                        validators={{ onChange: verifyEmailZodSchema.shape.email }}
                    >
                        {(field) => (
                            <AppField
                                field={field}
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                                disabled={!!email}
                            />
                        )}
                    </form.Field>

                    <form.Field
                        name="otp"
                        validators={{ onChange: verifyEmailZodSchema.shape.otp }}
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

                    {serverError && (
                        <Alert variant="destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <AppSubmitButton isPending={isPending} pendingLabel="Verifying Email...." >
                        Verify Email
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

export default VerifyEmailForm;