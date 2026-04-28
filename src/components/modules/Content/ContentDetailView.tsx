"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWatchlist } from "@/services/watchlist.services";
import { getMyTickets } from "@/services/ticket.services";
import { getMySubscriptions } from "@/services/subscription.services";
import { IContent } from "@/types/content.types";
import { ITicket } from "@/types/ticket.types";
import { ISubscription } from "@/types/subscription.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Eye, Calendar, User, Tag, BookmarkPlus, CreditCard, Ticket } from "lucide-react";
import { ReviewSection } from "./ReviewSection";
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

    console.warn("Could not extract YouTube video ID from URL:", url);
    return null;
  } catch (error) {
    console.error("Error parsing YouTube URL:", error, "URL:", url);
    return null;
  }
}

interface ContentDetailViewProps {
  content: IContent;
}

export function ContentDetailView({ content }: ContentDetailViewProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const queryClient = useQueryClient();

  const needsSubscription = content.accessType === "SUBSCRIPTION" || content.accessType === "BOTH";
  const needsTicket = content.accessType === "TICKET" || content.accessType === "BOTH";

  // Check if viewer has active subscription
  const { data: subscriptions, isLoading: loadingSubscriptions } = useQuery({
    queryKey: ["my-subscriptions"],
    queryFn: getMySubscriptions,
    enabled: needsSubscription,
    retry: false,
  });

  // Check if viewer has ticket for this content
  const { data: tickets, isLoading: loadingTickets } = useQuery({
    queryKey: ["my-tickets"],
    queryFn: getMyTickets,
    enabled: needsTicket,
    retry: false,
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

  // Check if user has access
  const hasActiveSubscription = subscriptions?.data?.some(
    (sub: ISubscription) => sub.status === "PAID" && new Date(sub.endDate) >= new Date()
  );

  const hasTicketForThisContent = tickets?.data?.some(
    (ticket: ITicket) => ticket.contentId === content.id && ticket.paymentStatus === "PAID"
  );

  const isLoadingAccess = needsSubscription && loadingSubscriptions || needsTicket && loadingTickets;

  const getWatchButton = () => {
    if (isLoadingAccess) {
      return <Skeleton className="h-12 w-48" />;
    }

    if (content.accessType === "FREE") {
      return (
        <Button asChild size="lg" className="flex items-center gap-2">
          <Link href={`/content/${content.id}/watch`}>
            <Play className="h-5 w-5" />
            Watch Now
          </Link>
        </Button>
      );
    }

    if (content.accessType === "TICKET") {
      return hasTicketForThisContent ? (
        <Button asChild size="lg" className="flex items-center gap-2">
          <Link href={`/content/${content.id}/watch`}>
            <Play className="h-5 w-5" />
            Watch Now
          </Link>
        </Button>
      ) : (
        <Button asChild size="lg" className="flex items-center gap-2">
          <Link href={`/dashboard/buy-ticket?contentId=${content.id}`}>
            <Ticket className="h-5 w-5" />
            Buy Ticket - ${content.ticketPrice}
          </Link>
        </Button>
      );
    }

    if (content.accessType === "SUBSCRIPTION") {
      return hasActiveSubscription ? (
        <Button asChild size="lg" className="flex items-center gap-2">
          <Link href={`/content/${content.id}/watch`}>
            <Play className="h-5 w-5" />
            Watch Now
          </Link>
        </Button>
      ) : (
        <Button asChild size="lg" className="flex items-center gap-2">
          <Link href="/payment/checkout">
            <CreditCard className="h-5 w-5" />
            Subscribe to Watch
          </Link>
        </Button>
      );
    }

    if (content.accessType === "BOTH") {
      if (hasActiveSubscription || hasTicketForThisContent) {
        return (
          <Button asChild size="lg" className="flex items-center gap-2">
            <Link href={`/content/${content.id}/watch`}>
              <Play className="h-5 w-5" />
              Watch Now
            </Link>
          </Button>
        );
      }

      // No access - show both options
      return (
        <div className="flex gap-3">
          <Button asChild size="lg" className="flex items-center gap-2">
            <Link href={`/dashboard/buy-ticket?contentId=${content.id}`}>
              <Ticket className="h-5 w-5" />
              Buy Ticket - ${content.ticketPrice}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="flex items-center gap-2">
            <Link href="/payment/checkout">
              <CreditCard className="h-5 w-5" />
              Subscribe
            </Link>
          </Button>
        </div>
      );
    }

    return null;
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

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {getWatchButton()}

              <Button
                variant="outline"
                size="lg"
                onClick={handleAddToWatchlist}
                disabled={isAddingToWatchlist}
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
              <div className="aspect-video">
                {(() => {
                  const embedUrl = getYouTubeEmbedUrl(content.trailerUrl);
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