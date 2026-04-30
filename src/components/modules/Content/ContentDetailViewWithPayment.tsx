"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { addToWatchlist } from "@/services/watchlist.services";
import { checkContentAccess } from "@/services/content.services";
import { useAuth } from "@/lib/auth";
import { IContent } from "@/types/content.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Eye, Calendar, User, Tag, BookmarkPlus } from "lucide-react";
import { ReviewSection } from "./ReviewSection";
import { PaymentFlowUI } from "@/hooks/usePaymentFlow";
import { toast } from "sonner";

// Helper to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  try {
    // Handle youtu.be short URLs (e.g., https://youtu.be/kegFziem1-I)
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]?.split('#')[0];
      if (videoId && videoId.length === 11) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      }
    }

    // Handle youtube.com/watch?v=VIDEO_ID
    if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get('v');
      if (videoId && videoId.length === 11) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      }
    }

    // Handle youtube.com/embed/VIDEO_ID
    if (url.includes('youtube.com/embed/')) {
      const parts = url.split('youtube.com/embed/');
      const videoId = parts[1]?.split('?')[0]?.split('#')[0];
      if (videoId && videoId.length === 11) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      }
    }

    // Fallback: try to extract any 11-character alphanumeric string (YouTube video ID)
    const match = url.match(/[a-zA-Z0-9_-]{11}/);
    if (match && match[0].length === 11) {
      return `https://www.youtube.com/embed/${match[0]}?autoplay=0&rel=0`;
    }

    return null;
  } catch (error) {
    console.error("Error parsing YouTube URL:", error);
    return null;
  }
}

interface ContentDetailViewWithPaymentProps {
  content: IContent;
}

export function ContentDetailViewWithPayment({ content }: ContentDetailViewWithPaymentProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [canAccess, setCanAccess] = useState(false);
  const [accessDetails, setAccessDetails] = useState<any>(null);

  // Check content access if user is logged in
  const { isLoading: isCheckingAccess } = useQuery({
    queryKey: ["content-access", content.id],
    queryFn: async () => {
      if (!session?.user) return null;
      try {
        const response = await checkContentAccess(content.id);
        if (response.success && response.data) {
          setCanAccess(response.data.canAccess);
          setAccessDetails(response.data);
        }
        return response.data;
      } catch (error) {
        console.error("Error checking content access:", error);
        return null;
      }
    },
    enabled: !!session?.user,
  });

  const { mutateAsync: addToWatchlistMutation, isPending: isAddingToWatchlist } = useMutation({
    mutationFn: (contentId: string) => addToWatchlist({ contentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-watchlist"] });
      toast.success("Added to watchlist!");
    },
    onError: () => {
      toast.error("Failed to add to watchlist");
    },
  });

  const handleAddToWatchlist = () => {
    addToWatchlistMutation(content.id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative mb-8 overflow-hidden rounded-lg bg-gradient-to-r from-background to-muted">
        <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center">
          {/* Poster */}
          <div className="relative h-96 w-64 flex-shrink-0 overflow-hidden rounded-lg shadow-lg">
            {content.posterUrl ? (
              <Image
                src={content.posterUrl}
                alt={content.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
          </div>

          {/* Content Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl font-bold">{content.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{content.releaseYear}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{content.views} views</span>
                </div>
                <Badge variant="outline">
                  {content.mediaType.replace("_", " ")}
                </Badge>
                <Badge variant={content.accessType === "FREE" ? "secondary" : "default"}>
                  {content.accessType}
                </Badge>
              </div>
            </div>

            {content.description && (
              <p className="text-lg leading-relaxed">{content.description}</p>
            )}

            {/* Cast & Director */}
            <div className="space-y-2">
              {content.director && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Director:</span>
                  <span>{content.director}</span>
                </div>
              )}

              {content.cast.length > 0 && (
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 mt-0.5" />
                  <span className="font-medium">Cast:</span>
                  <span>{content.cast.join(", ")}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {content.genres.length > 0 && (
              <div className="flex items-start gap-2">
                <Tag className="h-4 w-4 mt-0.5" />
                <span className="font-medium">Genres:</span>
                <div className="flex flex-wrap gap-1">
                  {content.genres.map((genre) => (
                    <Badge key={genre} variant="outline">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons & Payment Flow */}
            <div className="pt-4 space-y-4">
              {content.accessType === "FREE" && (
                <Button asChild size="lg" className="w-full flex items-center gap-2">
                  <Link href={`/content/${content.id}/watch`}>
                    <Play className="h-5 w-5" />
                    Watch Now
                  </Link>
                </Button>
              )}

              {/* Payment Flow Component for Premium Content */}
              {(content.accessType === "TICKET" || content.accessType === "SUBSCRIPTION" || content.accessType === "BOTH") && session?.user && (
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold mb-3">
                    {canAccess ? "Content Access" : "Get Access"}
                  </h3>
                  {isCheckingAccess ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                    </div>
                  ) : (
                    <PaymentFlowUI
                      contentId={content.id}
                      contentTitle={content.title}
                      ticketPrice={content.ticketPrice}
                      accessType={content.accessType}
                      canAccess={canAccess}
                      subscriptionPlans={[
                        { plan: "PREMIUM_MONTHLY", price: 9.99, duration: "1 Month" },
                        { plan: "PREMIUM_YEARLY", price: 99.99, duration: "1 Year" },
                      ]}
                    />
                  )}
                </div>
              )}

              {(content.accessType === "TICKET" || content.accessType === "SUBSCRIPTION" || content.accessType === "BOTH") && !session?.user && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <p className="text-blue-800 dark:text-blue-200 mb-3">
                    Sign in to purchase tickets or subscribe
                  </p>
                  <Button asChild className="w-full" size="lg">
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              )}

              {content.trailerUrl && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowTrailer(!showTrailer)}
                  className="w-full flex items-center gap-2"
                >
                  <Play className="h-5 w-5" />
                  {showTrailer ? "Hide" : "Show"} Trailer
                </Button>
              )}

              <Button
                variant="outline"
                size="lg"
                onClick={handleAddToWatchlist}
                disabled={isAddingToWatchlist}
                className="w-full"
              >
                <BookmarkPlus className="h-5 w-5 mr-2" />
                {isAddingToWatchlist ? "Adding..." : "Add to Watchlist"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer */}
      {showTrailer && content.trailerUrl && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Trailer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {(() => {
                  const embedUrl = getYouTubeEmbedUrl(content.trailerUrl);
                  if (embedUrl) {
                    return (
                      <iframe
                        src={embedUrl}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`${content.title} Trailer`}
                      />
                    );
                  }
                  return (
                    <video
                      src={content.trailerUrl}
                      controls
                      className="h-full w-full rounded-lg"
                    />
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reviews Section */}
      <ReviewSection contentId={content.id} />
    </div>
  );
}
