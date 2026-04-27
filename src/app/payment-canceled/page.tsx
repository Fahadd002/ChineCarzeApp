"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

const PaymentCanceledPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Payment Canceled</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <XCircle className="h-16 w-16 mx-auto text-muted-foreground" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Your payment was canceled</p>
            <p className="text-sm text-muted-foreground">
              Don&#39;t worry, your ticket has not been purchased. You can try again anytime.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/dashboard">
                Return to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/content">
                Browse Content
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCanceledPage;
