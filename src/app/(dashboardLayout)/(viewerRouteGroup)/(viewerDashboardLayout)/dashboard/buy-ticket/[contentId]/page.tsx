"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getContentById } from "@/services/content.services";
import { purchaseTicket } from "@/services/ticket.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const BuyTicketPage = () => {
  const params = useParams();
  const contentId = params.contentId as string;
  const router = useRouter();

  const { data: content, isLoading, error } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => getContentById(contentId),
    enabled: !!contentId,
  });

  const { mutateAsync: purchase, isPending } = useMutation({
    mutationFn: (payload: { contentId: string; paymentMethodId: string }) =>
      purchaseTicket(payload),
  });

  const handlePurchase = async () => {
    try {
      // For now, using a dummy payment method ID
      // In a real app, this would come from Stripe or another payment processor
      const response = await purchase({
        contentId,
        paymentMethodId: "dummy_payment_method",
      });

      if (response.success) {
        toast.success("Ticket purchased successfully!");
        router.push("/dashboard/purchase-history");
      } else {
        toast.error(response.message || "Failed to purchase ticket");
      }
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      toast.error("Failed to purchase ticket");
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Buy Ticket</CardTitle>
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
                <p className="text-2xl font-bold">${contentData.ticketPrice || 9.99}</p>
                <p className="text-sm text-muted-foreground">USD</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <p className="text-muted-foreground mb-4">
              Payment integration will be implemented with Stripe.
              For now, this is a demo purchase.
            </p>
            <Button
              onClick={handlePurchase}
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Processing..." : `Purchase for $${contentData.ticketPrice || 9.99}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyTicketPage;