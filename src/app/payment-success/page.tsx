/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { getDefaultDashboardRoute, UserRole } from "@/lib/authUtils";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const { session, loading } = useAuth();

  useEffect(() => {
    if (sessionId) {
      // The payment status is handled by Stripe webhook.
      // We just confirm the redirect.
      setSuccess(true);
      setVerifying(false);
    } else {
      setVerifying(false);
    }
  }, [sessionId]);

  // Determine the correct dashboard route based on user role
  const dashboardRoute = !loading && session?.user?.role
    ? getDefaultDashboardRoute(session.user.role as UserRole)
    : "/dashboard";

  if (verifying) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Payment Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <XCircle className="h-16 w-16 mx-auto text-destructive" />
            <p>We could not verify your payment. Please try again.</p>
            <Button asChild>
              <Link href={dashboardRoute}>Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-green-600">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Thank you for your purchase!</p>
            <p className="text-sm text-muted-foreground">
              Your ticket is now active. You can watch the content from your dashboard or the content details page.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href={`${dashboardRoute === "/dashboard" ? "/dashboard/my-tickets" : dashboardRoute}`}>
                View My Tickets
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={dashboardRoute}>
                Return to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
