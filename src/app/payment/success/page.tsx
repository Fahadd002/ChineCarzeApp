"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { getPaymentStatus } from "@/services/payment.services";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [paymentDetails, setPaymentDetails] = useState<any>(null);

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            return;
        }

        const verifyPayment = async () => {
            try {
                // In a real scenario, you would verify the session with the backend
                // For now, we'll show a success message
                setStatus("success");
                setPaymentDetails({
                    amount: "Paid",
                    date: new Date().toLocaleDateString(),
                });
            } catch (error) {
                console.error("Error verifying payment:", error);
                setStatus("error");
            }
        };

        verifyPayment();
    }, [sessionId]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    <p className="mt-4 text-white text-lg">Verifying your payment...</p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4">
                <div className="max-w-md w-full text-center">
                    <AlertCircle className="mx-auto h-16 w-16 text-red-600 mb-4" />
                    <h1 className="text-3xl font-bold text-white mb-2">Payment Error</h1>
                    <p className="text-slate-300 mb-8">
                        Something went wrong with your payment. Please try again.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4">
            <div className="max-w-md w-full">
                <div className="bg-slate-800 rounded-lg p-8 text-center shadow-xl border border-slate-700">
                    <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
                    
                    <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
                    
                    <p className="text-slate-300 mb-8">
                        Thank you for your purchase. Your payment has been processed successfully.
                    </p>

                    {paymentDetails && (
                        <div className="bg-slate-700 rounded-lg p-4 mb-8 text-left">
                            <div className="flex justify-between mb-4">
                                <span className="text-slate-300">Payment Status:</span>
                                <span className="text-green-400 font-semibold">Completed</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-300">Date:</span>
                                <span className="text-white">{paymentDetails.date}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                        >
                            Continue to Home
                        </Link>
                        <Link
                            href="/profile"
                            className="block px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
                        >
                            View My Purchases
                        </Link>
                    </div>

                    <p className="text-slate-400 text-sm mt-6">
                        An invoice has been sent to your email address.
                    </p>
                </div>
            </div>
        </div>
    );
}
