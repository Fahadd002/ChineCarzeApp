"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToWatchlist } from "@/services/watchlist.services";
import { IContent } from "@/types/content.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Eye, Calendar, User, Tag, BookmarkPlus } from "lucide-react";
import { ReviewSection } from "./ReviewSection";
import { toast } from "sonner";

interface ContentDetailViewProps {
  content: IContent;
}

export function ContentDetailView({ content }: ContentDetailViewProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const queryClient = useQueryClient();

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

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {content.accessType === "FREE" && (
                <Button asChild size="lg" className="flex items-center gap-2">
                  <Link href={`/content/${content.id}/watch`}>
                    <Play className="h-5 w-5" />
                    Watch Now
                  </Link>
                </Button>
              )}

              {content.accessType === "TICKET" && (
                <Button asChild size="lg" className="flex items-center gap-2">
                  <Link href={`/dashboard/buy-ticket/${content.id}`}>
                    <Play className="h-5 w-5" />
                    Buy Ticket - ${content.ticketPrice || 9.99}
                  </Link>
                </Button>
              )}

              {content.accessType === "SUBSCRIPTION" && (
                <Button asChild size="lg" className="flex items-center gap-2">
                  <Link href={`/content/${content.id}/watch`}>
                    <Play className="h-5 w-5" />
                    Watch with Subscription
                  </Link>
                </Button>
              )}

              {content.trailerUrl && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowTrailer(!showTrailer)}
                  className="flex items-center gap-2"
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
                <video
                  src={content.trailerUrl}
                  controls
                  className="h-full w-full rounded-lg"
                />
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