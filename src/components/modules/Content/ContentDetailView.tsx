/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWatchlist } from "@/services/watchlist.services";
import { getMyTickets } from "@/services/ticket.services";
import { getMySubscriptions } from "@/services/subscription.services";
import { createCheckoutSession } from "@/services/ticket.services";
import { IContent } from "@/types/content.types";
import { ITicket } from "@/types/ticket.types";
import { ISubscription } from "@/types/subscription.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShimmerSkeleton } from "@/components/ui/motion";
import { motion } from "framer-motion";
import {
  Play,
  Eye,
  Calendar,
  User,
  Tag,
  BookmarkPlus,
  CreditCard,
  Ticket,
  Sparkles,
  Star,
  Film,
  Loader2
} from "lucide-react";
import { ReviewSection } from "./ReviewSection";
import { toast } from "sonner";
import { AnimatedButton } from "@/components/ui/motion";
import { FloatingOrb } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

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
  const [isPurchasingTicket, setIsPurchasingTicket] = useState(false);
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
  const { data: tickets, isLoading: loadingTickets, refetch: refetchTickets } = useQuery({
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

  const handleBuyTicket = async () => {
    setIsPurchasingTicket(true);
    try {
      const sessionResponse = await createCheckoutSession(content.id);
      
      if (!sessionResponse.success) {
        const message = sessionResponse.message || "Failed to create checkout session";
        
        // Check if already purchased
        if (message.toLowerCase().includes("already purchased") || 
            message.toLowerCase().includes("already have a ticket")) {
          toast.info("You already have a ticket for this content");
          // Refresh tickets to update UI
          await refetchTickets();
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
      console.error("Payment error:", error);
      
      let errorMessage = "Failed to initiate payment. Please try again.";
      
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
        await refetchTickets();
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsPurchasingTicket(false);
    }
  };

  // Check if user has access
  const hasActiveSubscription = subscriptions?.data?.some(
    (sub: ISubscription) => sub.status === "PAID" && new Date(sub.endDate) >= new Date()
  );

  const hasTicketForThisContent = tickets?.data?.some(
    (ticket: ITicket) => ticket.contentId === content.id && ticket.paymentStatus === "PAID"
  );

  const isLoadingAccess = (needsSubscription && loadingSubscriptions) || (needsTicket && loadingTickets);

  // Compute average rating from reviews if available
  const averageRating = content.reviews && content.reviews.length > 0
    ? content.reviews.reduce((sum, review) => sum + review.rating, 0) / content.reviews.length
    : 0;

  const getWatchButton = () => {
    if (isLoadingAccess) {
      return <ShimmerSkeleton className="h-12 w-48" />;
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
        <Button 
          size="lg" 
          onClick={handleBuyTicket}
          disabled={isPurchasingTicket}
          className="flex items-center gap-2"
        >
          {isPurchasingTicket ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Ticket className="h-5 w-5" />
              Buy Ticket - ${content.ticketPrice}
            </>
          )}
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
          <Button 
            size="lg" 
            onClick={handleBuyTicket}
            disabled={isPurchasingTicket}
            className="flex items-center gap-2"
          >
            {isPurchasingTicket ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Ticket className="h-5 w-5" />
                Buy Ticket - ${content.ticketPrice}
              </>
            )}
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
    <div className="min-h-screen">
      {/* Cinematic Hero Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[50vh] min-h-[400px] overflow-hidden"
      >
        {/* Background image with parallax - use poster as banner fallback */}
        {content.posterUrl ? (
          <div className="absolute inset-0">
            <Image
              src={content.posterUrl}
              alt={content.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-purple-950/20 to-zinc-950/60" />
        )}

        {/* Floating orbs/particles when no image */}
        {!content.posterUrl && (
          <>
            <FloatingOrb color="red" size="md" className="top-10 right-10 opacity-20" />
            <FloatingOrb color="purple" size="lg" className="bottom-10 left-10 opacity-20" />
            <FloatingOrb color="blue" size="sm" className="top-1/2 left-1/2 opacity-10" />
          </>
        )}

        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-6 md:flex-row md:items-end"
          >
            {/* Movie Poster with hover effect */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative h-72 w-48 md:h-80 md:w-56 flex-shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-2 ring-white/10"
            >
              {content.posterUrl ? (
                <Image
                  src={content.posterUrl}
                  alt={content.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 30vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted">
                  <Film className="h-12 w-12 text-muted-foreground/50" />
                </div>
              )}

              {/* Access badge on poster */}
              <div className="absolute top-2 right-2">
                <Badge
                  className={cn(
                    "backdrop-blur-sm border-0 text-xs font-semibold",
                    content.accessType === "FREE" ? "bg-emerald-500/90" :
                    content.accessType === "SUBSCRIPTION" ? "bg-blue-500/90" :
                    content.accessType === "TICKET" ? "bg-rose-500/90" : "bg-purple-500/90"
                  )}
                >
                  {content.accessType}
                </Badge>
              </div>
            </motion.div>

            {/* Content Info */}
            <div className="flex-1 space-y-4">
              {/* Title with gradient */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
                >
                  {content.title}
                </motion.h1>

                {/* Meta info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-300"
                >
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {content.releaseYear}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    {(content.views || 0).toLocaleString()} views
                  </span>
                  {averageRating > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="font-medium text-amber-400">{averageRating.toFixed(1)}</span>
                    </span>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {content.mediaType.replace("_", " ")}
                  </Badge>
                  <Badge
                    variant="default"
                    className={cn(
                      "text-xs font-semibold border-0",
                      content.accessType === "FREE" ? "bg-emerald-500" :
                      content.accessType === "SUBSCRIPTION" ? "bg-blue-500" :
                      content.accessType === "TICKET" ? "bg-rose-500" : "bg-purple-500"
                    )}
                  >
                    {content.accessType}
                  </Badge>
                </motion.div>
              </div>

              {/* Description */}
              {content.description && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="max-w-2xl text-gray-300 leading-relaxed line-clamp-3"
                >
                  {content.description}
                </motion.p>
              )}

              {/* Meta details */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4 text-sm"
              >
                {/* Director */}
                {content.director && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Director:</span>
                    <span className="font-medium text-foreground">{content.director}</span>
                  </div>
                )}

                {/* Cast */}
                {content.cast.length > 0 && (
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">Cast:</span>
                    <span className="text-foreground">{content.cast.slice(0, 5).join(", ")}{content.cast.length > 5 ? "..." : ""}</span>
                  </div>
                )}
              </motion.div>

              {/* Genres */}
              {content.genres.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-wrap gap-2"
                >
                  <Tag className="h-4 w-4 text-muted-foreground mt-1" />
                  {content.genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant="outline"
                      className="border-white/10 bg-zinc-950/30 hover:bg-zinc-900/50 transition-colors"
                    >
                      {genre}
                    </Badge>
                  ))}
                </motion.div>
              )}

              {/* Action Buttons - FIXED */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                {/* Primary Watch Button with fixed click handling */}
                <div className="relative group">
                  {/* Gradient blur effect behind the button - now with pointer-events-none */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-500 pointer-events-none" />
                  {getWatchButton()}
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddToWatchlist}
                  disabled={isAddingToWatchlist}
                  className="gap-2 border-white/10 bg-zinc-950/50 hover:bg-zinc-900 hover:border-white/20"
                >
                  <BookmarkPlus className="h-5 w-5" />
                  {isAddingToWatchlist ? "Adding..." : "Add to Watchlist"}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        {/* Trailer Section */}
        {!showTrailer && content.trailerUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <Button
              onClick={() => setShowTrailer(true)}
              variant="outline"
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Watch Trailer
            </Button>
          </motion.div>
        )}

        {showTrailer && content.trailerUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <Card className="overflow-hidden border-0 bg-gradient-to-b from-zinc-900/50 to-transparent shadow-2xl">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-red-500" />
                  <span className="bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                    Official Trailer
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video relative bg-black">
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
                        className="h-full w-full"
                      />
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ReviewSection contentId={content.id} />
        </motion.div>
      </div>
    </div>
  );
}