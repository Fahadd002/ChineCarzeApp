"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getWatchableContent, getContentById } from "@/services/content.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Ticket, CreditCard, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Helper to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }
  }
  return null;
}

const WatchPage = () => {
  const params = useParams();
  const contentId = params.id as string;

  const { data: content, isLoading, error } = useQuery({
    queryKey: ["content", contentId, "watch"],
    queryFn: () => getWatchableContent(contentId),
    enabled: !!contentId,
    retry: false,
  });

  // Also fetch basic content info for trailer/poster
  const { data: basicContent } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => getContentById(contentId),
    enabled: !!contentId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="aspect-video w-full mb-4" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    );
  }

  const contentData = content?.data;
  const basicData = basicContent?.data;

  // Handle access denied
  if (error || !content?.success) {
    const statusCode = (error as any)?.response?.status;
    const message = (error as any)?.response?.data?.message || "Access denied";

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Button asChild variant="outline">
            <Link href={`/content/${contentId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Details
            </Link>
          </Button>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-6 w-6" />
              Access Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{message || "This content requires payment to watch."}</p>

            {/* Always show trailer even if can't watch full video */}
            {basicData?.trailerUrl && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Watch Trailer</h3>
                <div className="aspect-video">
                  {(() => {
                    const embedUrl = getYouTubeEmbedUrl(basicData.trailerUrl);
                    if (embedUrl) {
                      return (
                        <iframe
                          src={embedUrl}
                          className="h-full w-full rounded-lg"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      );
                    }
                    return (
                      <video
                        src={basicData.trailerUrl}
                        controls
                        className="h-full w-full rounded-lg"
                        poster={basicData.posterUrl}
                      />
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Action buttons based on access type */}
            {basicData && (
              <div className="mt-6 space-y-3">
                <h3 className="text-lg font-semibold">Get Access</h3>

                {basicData.accessType === "TICKET" && (
                  <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Ticket className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Buy a Ticket</span>
                      <span className="ml-auto font-bold">${basicData.ticketPrice?.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-blue-800 mb-3">
                      One-time purchase to watch this content unlimited times.
                    </p>
                    <Button asChild className="w-full">
                      <Link href={`/dashboard/buy-ticket?contentId=${basicData.id}`}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Purchase Ticket
                      </Link>
                    </Button>
                  </div>
                )}

                {(basicData.accessType === "SUBSCRIPTION" || basicData.accessType === "BOTH") && (
                  <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Get Premium Subscription</span>
                    </div>
                    <p className="text-sm text-purple-800 mb-3">
                      Subscribe to watch this and all premium content.
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/payment/checkout">
                        View Subscription Plans
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has access — show the video
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Button asChild variant="outline">
          <Link href={`/content/${contentId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Details
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{contentData?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {contentData?.streamingUrl ? (
            <div className="aspect-video">
              {(() => {
                const embedUrl = getYouTubeEmbedUrl(contentData.streamingUrl);
                if (embedUrl) {
                  return (
                    <iframe
                      src={embedUrl}
                      className="h-full w-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }
                return (
                  <video
                    src={contentData.streamingUrl}
                    controls
                    className="h-full w-full rounded-lg"
                    poster={contentData.posterUrl}
                    autoPlay
                  >
                    Your browser does not support the video tag.
                  </video>
                );
              })()}
            </div>
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Video not available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WatchPage;