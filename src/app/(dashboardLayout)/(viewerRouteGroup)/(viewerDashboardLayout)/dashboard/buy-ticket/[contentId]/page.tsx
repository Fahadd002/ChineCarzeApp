/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getContentById } from "@/services/content.services";
import { createCheckoutSession } from "@/services/ticket.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AlertTriangle, CreditCard, Ticket, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const BuyTicketPage = () => {
  const params = useParams();
  const contentId = params.contentId as string;
  const router = useRouter();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const { 
    data: contentResponse, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => getContentById(contentId),
    enabled: !!contentId,
    retry: 1,
  });

  const handleBuyTicket = async () => {
    if (!contentId) {
      toast.error("Content ID is missing");
      return;
    }

    setIsPurchasing(true);
    
    try {
      // Call the createCheckoutSession with contentId
      const sessionResponse = await createCheckoutSession(contentId);
      
      console.log("Session response:", sessionResponse); // Debug log
      
      if (!sessionResponse.success) {
        const message = sessionResponse.message || "Failed to create checkout session";
        
        // Check for "already purchased" message
        if (message.toLowerCase().includes("already purchased") || 
            message.toLowerCase().includes("already have a ticket")) {
          toast.info("You already have a ticket for this content");
          router.push("/dashboard/my-tickets");
          return;
        }
        
        throw new Error(message);
      }
      
      // Check if we have the redirect URL
      if (!sessionResponse.data?.url) {
        throw new Error("No checkout URL received from server");
      }
      
      // Redirect to Stripe checkout
      window.location.href = sessionResponse.data.url;
      
    } catch (error: any) {
      console.error("Payment error details:", error);
      
      let errorMessage = "Failed to initiate payment. Please try again.";
      
      // Handle different error formats
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Check for "already purchased" in error message
      if (errorMessage.toLowerCase().includes("already purchased") || 
          errorMessage.toLowerCase().includes("already have a ticket")) {
        toast.info("You already have a ticket for this content");
        router.push("/dashboard/my-tickets");
      } else {
        toast.error(errorMessage);
      }
      
      setIsPurchasing(false);
    }
  };

 

  // Error state
  if (error || !contentResponse?.success || !contentResponse?.data) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Error Loading Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {error?.message || contentResponse?.message || "Content not found or failed to load."}
            </p>
            <div className="flex gap-3">
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
              <Button asChild>
                <Link href="/dashboard/browse">Browse Content</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const contentData = contentResponse.data;
  const ticketPrice = contentData.ticketPrice ?? 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        className="mb-4 -ml-2" 
        asChild
      >
        <Link href={`/content/${contentId}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Content
        </Link>
      </Button>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="text-2xl">Complete Your Purchase</CardTitle>
          <p className="text-muted-foreground text-sm mt-1">
            Get lifetime access to this content with a one-time ticket purchase
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          {/* Content Info */}
          <div className="flex gap-6 flex-col sm:flex-row">
            {/* Poster */}
            <div className="relative w-full sm:w-40 h-60 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
              {contentData.posterUrl ? (
                <Image
                  src={contentData.posterUrl}
                  alt={contentData.title}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Ticket className="h-12 w-12 text-muted-foreground/50" />
                </div>
              )}
            </div>
            
            {/* Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{contentData.title}</h2>
              {contentData.description && (
                <p className="text-muted-foreground mt-2 line-clamp-3">
                  {contentData.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">{contentData.mediaType?.replace("_", " ")}</Badge>
                <Badge variant="outline">{contentData.releaseYear}</Badge>
                {contentData.genres?.slice(0, 3).map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
                <Badge className="bg-rose-500/90 text-white border-0">
                  {contentData.accessType === "BOTH" ? "TICKET + SUB" : "TICKET"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Ticket Price</h3>
                <p className="text-sm text-muted-foreground">
                  One-time purchase • Lifetime access • Watch anytime
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  ${ticketPrice.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">USD (tax included)</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="flex items-start gap-3 p-4 border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <p className="font-medium">Secure Payment via Stripe</p>
                <p className="text-blue-700 dark:text-blue-400">
                  You will be redirected to Stripes secure payment page to complete your purchase.
                  We accept all major credit cards.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={handleBuyTicket}
              disabled={isPurchasing}
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isPurchasing ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Preparing Checkout...
                </>
              ) : (
                <>
                  <Ticket className="h-5 w-5 mr-2" />
                  Pay ${ticketPrice.toFixed(2)} and Get Ticket
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              asChild
            >
              <Link href={`/content/${contentId}`}>
                Cancel
              </Link>
            </Button>
          </div>

          {/* Note */}
          <p className="text-xs text-center text-muted-foreground pt-4 border-t">
            By purchasing this ticket, you agree to our Terms of Service and Privacy Policy.
            Tickets are non-refundable and provide lifetime access to this specific content.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyTicketPage;