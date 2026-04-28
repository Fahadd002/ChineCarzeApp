"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getContentById } from "@/services/content.services";
import { createCheckoutSession } from "@/services/ticket.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AlertTriangle, CreditCard, Ticket } from "lucide-react";

const BuyTicketPage = () => {
  const params = useParams();
  const contentId = params.contentId as string;
  const router = useRouter();

  const [isPurchasing, setIsPurchasing] = useState(false);

  const { data: content, isLoading, error } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => getContentById(contentId),
    enabled: !!contentId,
  });

  const handleBuyTicket = async () => {
    setIsPurchasing(true);
    try {
      // Create Stripe checkout session (also creates/updates ticket)
      const sessionResponse = await createCheckoutSession(contentId);
      if (!sessionResponse.success || !sessionResponse.data?.url) {
        const message = sessionResponse.message || "Failed to create checkout session";
        // Check if already purchased
        if (message?.includes("already purchased")) {
          toast.info("You already have a ticket for this content");
          router.push("/dashboard/my-tickets");
          return;
        }
        throw new Error(message);
      }

      // Redirect to Stripe
      window.location.href = sessionResponse.data.url;
    } catch (error: any) {
      console.error("Payment error:", error);
      let errorMessage = "Failed to initiate payment";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // Check if already purchased
      if (errorMessage.includes("already purchased")) {
        toast.info("You already have a ticket for this content");
        router.push("/dashboard/my-tickets");
      } else {
        toast.error(errorMessage);
      }
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Buy Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !content?.data) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Buy Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">Content not found or failed to load.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

   const contentData = content.data;

  // Verify this content requires a ticket
  if (contentData.accessType !== "TICKET") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invalid Purchase</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">This content does not require a ticket purchase.</p>
            <Button asChild className="mt-4">
              <a href={`/content/${contentId}`}>Back to Content</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

   if (!contentData.ticketPrice || contentData.ticketPrice <= 0) {
     return (
       <div className="space-y-6">
         <Card>
           <CardHeader>
             <CardTitle>Buy Ticket</CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-red-500">This content does not have a valid ticket price.</p>
           </CardContent>
         </Card>
       </div>
     );
   }

   const ticketPrice = contentData.ticketPrice ?? 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-6">
            {contentData.posterUrl && (
              <img
                src={contentData.posterUrl}
                alt={contentData.title}
                className="w-32 h-48 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{contentData.title}</h2>
              <p className="text-muted-foreground mt-2">
                {contentData.description}
              </p>
              <div className="flex gap-2 mt-4">
                <Badge variant="outline">{contentData.mediaType}</Badge>
                <Badge variant="outline">{contentData.releaseYear}</Badge>
                {contentData.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Ticket Price</h3>
                <p className="text-muted-foreground">
                  One-time purchase for unlimited viewing
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${ticketPrice.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">USD</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="flex items-start gap-3 p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Secure Payment via Stripe</p>
                <p>You'll be redirected to Stripe's secure payment page to complete your purchase.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={handleBuyTicket}
              disabled={isPurchasing}
              className="w-full"
              size="lg"
            >
              {isPurchasing ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  Redirecting to Payment...
                </>
              ) : (
                <>
                  <Ticket className="h-5 w-5 mr-2" />
                  Pay ${ticketPrice.toFixed(2)} and Get Ticket
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
