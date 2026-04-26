"use client";

import { useState, useEffect } from "react";
import { getReviewsByContent } from "@/services/review.services";
import { IReview } from "@/types/review.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import { ReviewForm } from "./ReviewForm";

interface ReviewSectionProps {
  contentId: string;
}

interface ReviewsResponse {
  averageRating: number;
  totalReviews: number;
  reviews: IReview[];
}

export function ReviewSection({ contentId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [contentId]);

  const loadReviews = async () => {
    try {
      const response = await getReviewsByContent(contentId);
      if (response.success && response.data) {
        const data = response.data as unknown as ReviewsResponse;
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = () => {
    setShowReviewForm(false);
    loadReviews();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Reviews ({reviews.length})</CardTitle>
          <Button onClick={() => setShowReviewForm(!showReviewForm)}>
            {showReviewForm ? "Cancel" : "Write Review"}
          </Button>
        </CardHeader>
        <CardContent>
          {showReviewForm && (
            <div className="mb-6">
              <ReviewForm contentId={contentId} onReviewAdded={handleReviewAdded} />
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface ReviewCardProps {
  review: IReview;
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={review.viewer.profilePhoto} />
            <AvatarFallback>
              {review.viewer.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{review.viewer.name}</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>

            {review.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {review.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {review.hasSpoiler && (
              <Badge variant="destructive" className="text-xs">
                Contains Spoilers
              </Badge>
            )}

            <div className="flex items-center gap-4 pt-2">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{review.likesCount}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}