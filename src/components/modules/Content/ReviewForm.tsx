/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createReview } from "@/services/review.services";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { toast } from "sonner";
import AppSubmitButton from "@/components/shared/AppSubmitButton";

interface ReviewFormProps {
  contentId: string;
  onReviewAdded: () => void;
}

const availableTags = [
  "Great Acting",
  "Amazing Story",
  "Visual Effects",
  "Soundtrack",
  "Direction",
  "Cinematography",
  "Emotional",
  "Thrilling",
  "Funny",
  "Thought-provoking",
];

export function ReviewForm({ contentId, onReviewAdded }: ReviewFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: any) => createReview({
      contentId,
      rating: payload.rating,
      tags: selectedTags,
      hasSpoiler: payload.hasSpoiler,
    }),
  });

  const form = useForm({
    defaultValues: {
      rating: 5,
      hasSpoiler: false,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await mutateAsync(value);
        if (response.success) {
          toast.success("Review submitted successfully!");
          onReviewAdded();
          form.reset();
          setSelectedTags([]);
        } else {
          toast.error(response.message || "Failed to submit review");
        }
      } catch (error: any) {
        console.error("Error submitting review:", error);
        toast.error("Failed to submit review");
      }
    },
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Rating */}
          <form.Field name="rating">
            {(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => field.handleChange(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (field.state.value || 5)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form.Field>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags (optional)</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Spoiler Warning */}
          <form.Field name="hasSpoiler">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={field.state.value || false}
                  onCheckedChange={(checked) => field.handleChange(checked as boolean)}
                />
                <label className="text-sm font-medium">
                  This review contains spoilers
                </label>
              </div>
            )}
          </form.Field>

          {/* Submit Button */}
          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Submitting..."
                disabled={!canSubmit}
              >
                Submit Review
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}