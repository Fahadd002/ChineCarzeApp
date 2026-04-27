/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getContentById } from "@/services/content.services";
import { createCheckoutSession } from "@/services/ticket.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertTriangle, CreditCard, Ticket } from "lucide-react";
import { IContent } from "@/types/content.types";

const BuyTicketPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentId = searchParams.get("contentId");

  const [isPurchasing, setIsPurchasing] = useState(false);

  const { data: contentData, isLoading, error } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => getContentById(contentId!),
    enabled: !!contentId,
  });

  const content = contentData?.data as IContent | undefined;

  const handleBuyTicket = async () => {
    if (!contentId) return;

    setIsPurchasing(true);
    try {
      // Create Stripe checkout session (also creates ticket)
      const sessionResponse = await createCheckoutSession(contentId);
      if (!sessionResponse.success || !sessionResponse.data?.url) {
        throw new Error(sessionResponse.message || "Failed to create checkout session");
      }

      // Redirect to Stripe
      window.location.href = sessionResponse.data.url;
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error?.message || "Failed to initiate payment");
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Content Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">The content you are trying to purchase does not exist or has been removed.</p>
            <Button asChild>
              <a href="/dashboard">Return to Dashboard</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Purchase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Summary */}
          <div className="flex gap-4 p-4 border rounded-lg">
            {content.posterUrl && (
              <img
                src={content.posterUrl}
                alt={content.title}
                className="w-24 h-36 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{content.title}</h3>
              <p className="text-sm text-muted-foreground">
                {content.releaseYear} • {content.mediaType.replace("_", " ")}
              </p>
              {content.director && (
                <p className="text-sm">Director: {content.director}</p>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between text-lg font-semibold p-4 bg-muted rounded-lg">
            <span>Ticket Price</span>
            <span className="text-primary">${content.ticketPrice?.toFixed(2)}</span>
          </div>

          {/* Payment Info */}
          <div className="flex items-start gap-3 p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Secure Payment via Stripe</p>
              <p>You will be redirected to Stripes secure payment page to complete your purchase.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              onClick={handleBuyTicket}
              disabled={isPurchasing}
              className="w-full"
            >
              {isPurchasing ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  Redirecting to Payment...
                </>
              ) : (
                <>
                  <Ticket className="h-5 w-5 mr-2" />
                  Pay ${content.ticketPrice?.toFixed(2)} and Get Ticket
                </>
              )}
            </Button>
            <Button asChild variant="outline">
              <a href={`/content/${contentId}`}>Cancel</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyTicketPage;
