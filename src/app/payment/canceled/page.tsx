"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCanceledPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4">
            <div className="max-w-md w-full">
                <div className="bg-slate-800 rounded-lg p-8 text-center shadow-xl border border-slate-700">
                    <XCircle className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
                    
                    <h1 className="text-3xl font-bold text-white mb-2">Payment Canceled</h1>
                    
                    <p className="text-slate-300 mb-8">
                        Your payment has been canceled. No charges have been made to your account.
                    </p>

                    <p className="text-slate-400 text-sm mb-8">
                        You can try again anytime or contact support if you need help.
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/"
                            className="block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                        >
                            Back to Home
                        </Link>
                        <Link
                            href="/support"
                            className="block px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
