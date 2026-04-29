"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getWatchableContent, getContentById } from "@/services/content.services";
import { Card } from "@/components/ui/card";
import { ShimmerSkeleton } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Ticket, CreditCard, X, Play, Maximize2, Volume2, Film } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Helper to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  try {
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]?.split('#')[0];
      if (videoId && videoId.length === 11) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
    }

    if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get('v');
      if (videoId && videoId.length === 11) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
    }

    if (url.includes('youtube.com/embed/')) {
      const parts = url.split('youtube.com/embed/');
      const videoId = parts[1]?.split('?')[0]?.split('#')[0];
      if (videoId && videoId.length === 11) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
    }

    const match = url.match(/[a-zA-Z0-9_-]{11}/);
    if (match && match[0].length === 11) {
      return `https://www.youtube.com/embed/${match[0]}?autoplay=1&rel=0`;
    }

    return null;
  } catch (error) {
    console.error("Error parsing YouTube URL:", error);
    return null;
  }
}

const WatchPage = () => {
  const params = useParams();
  const contentId = params.id as string;
  const [showControls, setShowControls] = useState(true);

  const { data: content, isLoading, error } = useQuery({
    queryKey: ["content", contentId, "watch"],
    queryFn: () => getWatchableContent(contentId),
    enabled: !!contentId,
    retry: false,
  });

  const { data: basicContent } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => getContentById(contentId),
    enabled: !!contentId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
        <div className="container mx-auto px-4 py-8">
          {/* Back button skeleton */}
          <div className="mb-4">
            <ShimmerSkeleton className="h-10 w-32 rounded-lg" />
          </div>

          {/* Video player skeleton */}
          <div className="relative aspect-video w-full mb-6 rounded-2xl overflow-hidden">
            <ShimmerSkeleton className="h-full w-full" />
          </div>

          {/* Title skeleton */}
          <ShimmerSkeleton className="h-8 w-1/3 mb-4" />

          {/* Meta skeletons */}
          <div className="flex gap-4">
            <ShimmerSkeleton className="h-4 w-24" />
            <ShimmerSkeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  const contentData = content?.data;
  const basicData = basicContent?.data;

  // Handle access denied
  if (error || !content?.success) {
    const message = (error as any)?.response?.data?.message || "Access denied";

    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button asChild variant="outline" className="border-white/10 bg-zinc-900/50 hover:bg-zinc-800">
              <Link href={`/content/${contentId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Details
              </Link>
            </Button>
          </motion.div>

          {/* Access denied card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mt-8"
          >
            <Card className="border-red-500/20 bg-gradient-to-br from-red-950/30 to-zinc-950 backdrop-blur-xl overflow-hidden relative">
              {/* Glow accent */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.15),transparent_70%)]" />

              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="h-6 w-6" />
                  Access Required
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-300">{message}</p>

                {/* Trailer always available */}
                {basicData?.trailerUrl && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Play className="h-5 w-5 text-red-400" />
                      Watch Trailer
                    </h3>
                    <div className="aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                      {(() => {
                        const embedUrl = getYouTubeEmbedUrl(basicData.trailerUrl);
                        if (embedUrl) {
                          return (
                            <iframe
                              src={embedUrl}
                              className="h-full w-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={`${basicData.title} Trailer`}
                            />
                          );
                        }
                        return (
                          <video
                            src={basicData.trailerUrl}
                            controls
                            className="h-full w-full"
                            poster={basicData.posterUrl}
                          />
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Purchase options */}
                {basicData && (
                  <div className="mt-6 space-y-3">
                    <h3 className="text-lg font-semibold">Get Access</h3>

                    {basicData.accessType === "TICKET" && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border border-rose-500/30 bg-rose-950/20 rounded-xl"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Ticket className="h-5 w-5 text-rose-400" />
                          <span className="font-medium">Buy a Ticket</span>
                          <span className="ml-auto font-bold text-rose-400">${basicData.ticketPrice?.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">
                          One-time purchase to watch this content unlimited times.
                        </p>
                        <Button asChild className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 border-0 shadow-lg shadow-rose-500/30">
                          <Link href={`/dashboard/buy-ticket?contentId=${basicData.id}`}>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Purchase Ticket
                          </Link>
                        </Button>
                      </motion.div>
                    )}

                    {(basicData.accessType === "SUBSCRIPTION" || basicData.accessType === "BOTH") && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border border-purple-500/30 bg-purple-950/20 rounded-xl"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <CreditCard className="h-5 w-5 text-purple-400" />
                          <span className="font-medium">Get Premium Subscription</span>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">
                          Subscribe to watch this and all premium content.
                        </p>
                        <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border-0 shadow-lg shadow-purple-500/30">
                          <Link href="/payment/checkout">
                            View Subscription Plans
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // User has access — show the video in a cinematic theater
  return (
    <div className="min-h-screen bg-black">
      {/* Video Player Container */}
      <div className="relative w-full aspect-video bg-black">
        {/* Backdrop glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-purple-950/20 to-blue-950/20 pointer-events-none"
        />

        {/* Video */}
        {contentData?.streamingUrl ? (
          <div className="relative h-full w-full">
            {(() => {
              const embedUrl = getYouTubeEmbedUrl(contentData.streamingUrl);
              if (embedUrl) {
                return (
                  <iframe
                    src={embedUrl}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={contentData.title}
                  />
                );
              }
              return (
                <video
                  src={contentData.streamingUrl}
                  controls
                  className="h-full w-full"
                  poster={contentData.posterUrl}
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
              );
            })()}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400">Video not available</p>
          </div>
        )}

        {/* Overlay controls hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"
        >
          <p className="text-sm text-gray-300 text-center">
            Use native video controls to play, pause, and adjust volume
          </p>
        </motion.div>
      </div>

      {/* Content Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="container mx-auto px-4 py-8"
      >
        {/* Back button */}
        <div className="mb-6">
          <Button asChild variant="outline" className="border-white/10 bg-zinc-900/50 hover:bg-zinc-800">
            <Link href={`/content/${contentId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Details
            </Link>
          </Button>
        </div>

        {/* Movie details below video */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative h-64 w-48 md:h-80 md:w-56 flex-shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-2 ring-white/10 mx-auto md:mx-0"
          >
            {basicData?.posterUrl ? (
              <img
                src={basicData.posterUrl}
                alt={basicData.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <Film className="h-12 w-12 text-muted-foreground/50" />
              </div>
            )}
          </motion.div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {basicData?.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <span>{basicData?.releaseYear}</span>
              <span>•</span>
              <span>{(basicData?.views || 0).toLocaleString()} views</span>
              <span>•</span>
              <span>{basicData?.mediaType.replace("_", " ")}</span>
            </div>

            {basicData?.description && (
              <p className="text-gray-300 leading-relaxed max-w-3xl">
                {basicData.description}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 shadow-lg shadow-red-500/30"
              >
                <Link href={`/content/${contentId}`}>
                  View Details
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/10 bg-zinc-950/50 hover:bg-zinc-900"
              >
                <Link href={`/dashboard/buy-ticket?contentId=${contentId}`}>
                  <Ticket className="h-4 w-4 mr-2" />
                  Buy Ticket
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WatchPage;