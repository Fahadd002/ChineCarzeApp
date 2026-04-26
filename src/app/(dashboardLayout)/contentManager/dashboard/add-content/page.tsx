/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, startTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createContent, updateContent, getContentById } from "@/services/content.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import AppField from "@/components/shared/AppField";
import AppSubmitButton from "@/components/shared/AppSubmitButton";
import { Upload, X } from "lucide-react";
import { AccessType, MediaType } from "@/types/content.types";

const AddContentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentId = searchParams.get("id");
  const isEditing = !!contentId;

  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedCast, setSelectedCast] = useState<string[]>([]);

  // Fetch content data if editing
  const { data: existingContent, isLoading: isLoadingContent } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => getContentById(contentId!),
    enabled: isEditing,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: isEditing 
      ? (payload: any) => updateContent({ ...payload, id: contentId! })
      : createContent,
    onSuccess: () => {
      toast.success(isEditing ? "Content updated successfully!" : "Content created successfully!");
      router.push("/contentManager/dashboard/my-contents");
    },
    onError: (error: any) => {
      toast.error(error?.message || (isEditing ? "Failed to update content" : "Failed to create content"));
    },
  });

  const availableGenres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
    "Drama", "Family", "Fantasy", "Horror", "Mystery", "Romance",
    "Sci-Fi", "Thriller", "War", "Western"
  ];

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      releaseYear: new Date().getFullYear(),
      director: "",
      cast: [] as string[],
      genres: [] as string[],
      mediaType: MediaType.MOVIE as MediaType,
      accessType: AccessType.FREE as AccessType,
      ticketPrice: 0,
      posterImage: null as File | null,
      trailerVideo: "" as string,
      streamingVideo: "" as string,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = {
          ...value,
          cast: selectedCast,
          genres: selectedGenres,
          posterImage: value.posterImage ?? undefined,
          trailerVideo: value.trailerVideo || undefined,
          streamingVideo: value.streamingVideo || undefined,
        };

        await mutateAsync(payload);
      } catch (error: any) {
        console.error("Error saving content:", error);
      }
    },
  });

  // ✅ FIXED: Batch all updates using startTransition to prevent cascading renders
  useEffect(() => {
    if (isEditing && existingContent?.data) {
      startTransition(() => {
        const content = existingContent.data;
        
        // Batch all form field updates
        form.setFieldValue("title", content.title);
        form.setFieldValue("description", content.description || "");
        form.setFieldValue("releaseYear", content.releaseYear);
        form.setFieldValue("director", content.director || "");
        form.setFieldValue("cast", content.cast || []);
        form.setFieldValue("genres", content.genres || []);
        form.setFieldValue("mediaType", content.mediaType || MediaType.MOVIE);
        form.setFieldValue("accessType", content.accessType || AccessType.FREE);
        form.setFieldValue("ticketPrice", content.ticketPrice || 0);
        form.setFieldValue("trailerVideo", content.trailerUrl || "");
        form.setFieldValue("streamingVideo", content.streamingUrl || "");
        
        // Batch all state updates
        if (content.posterUrl) {
          setPosterPreview(content.posterUrl);
        }
        setSelectedCast(content.cast || []);
        setSelectedGenres(content.genres || []);
      });
    }
  }, [isEditing, existingContent]); // Remove 'form' from dependencies to avoid unnecessary re-runs

  const handleFileChange = (
    field: "posterImage",
    file: File | null,
  ) => {
    if (field === "posterImage" && file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPosterPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    form.setFieldValue(field, file);
  };

  const addGenre = (genre: string) => {
    if (!selectedGenres.includes(genre)) {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const removeGenre = (genre: string) => {
    setSelectedGenres(selectedGenres.filter(g => g !== genre));
  };

  const addCastMember = () => {
    const input = document.getElementById("cast-input") as HTMLInputElement;
    const name = input.value.trim();
    if (name && !selectedCast.includes(name)) {
      setSelectedCast([...selectedCast, name]);
      input.value = "";
    }
  };

  const removeCastMember = (member: string) => {
    setSelectedCast(selectedCast.filter(m => m !== member));
  };

  // Show loading state while fetching content for editing
  if (isEditing && isLoadingContent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{isEditing ? "Edit Content" : "Add New Content"}</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <form.Field name="title">
              {(field) => (
                <AppField
                  field={field}
                  label="Title"
                  type="text"
                  placeholder="Enter content title"
                  required
                />
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <AppField
                  field={field}
                  label="Description"
                  type="textarea"
                  placeholder="Enter content description"
                />
              )}
            </form.Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field name="releaseYear">
                {(field) => (
                  <AppField
                    field={field}
                    label="Release Year"
                    type="number"
                    placeholder="2024"
                    required
                  />
                )}
              </form.Field>

              <form.Field name="director">
                {(field) => (
                  <AppField
                    field={field}
                    label="Director"
                    type="text"
                    placeholder="Director name"
                  />
                )}
              </form.Field>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cast</label>
              <div className="flex gap-2">
                <input
                  id="cast-input"
                  type="text"
                  placeholder="Add cast member"
                  className="flex-1 px-3 py-2 border rounded-md"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCastMember())}
                />
                <Button type="button" onClick={addCastMember}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCast.map((member) => (
                  <Badge key={member} variant="secondary" className="cursor-pointer" onClick={() => removeCastMember(member)}>
                    {member} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Genres</label>
              <div className="flex flex-wrap gap-2">
                {availableGenres.map((genre) => (
                  <Badge
                    key={genre}
                    variant={selectedGenres.includes(genre) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => selectedGenres.includes(genre) ? removeGenre(genre) : addGenre(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field name="mediaType">
                {(field) => (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Media Type</label>
                    <select
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value as MediaType)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value={MediaType.MOVIE}>Movie</option>
                      <option value={MediaType.TV_SERIES}>TV Series</option>
                    </select>
                  </div>
                )}
              </form.Field>

              <form.Field name="accessType">
                {(field) => (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Access Type</label>
                    <select
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value as AccessType)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value={AccessType.FREE}>Free</option>
                      <option value={AccessType.TICKET}>Ticket</option>
                      <option value={AccessType.SUBSCRIPTION}>Subscription</option>
                    </select>
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field name="accessType">
              {(field) => field.state.value === AccessType.TICKET && (
                <form.Field name="ticketPrice">
                  {(priceField) => (
                    <AppField
                      field={priceField}
                      label="Ticket Price ($)"
                      type="number"
                      step="0.01"
                      placeholder="9.99"
                      required
                    />
                  )}
                </form.Field>
              )}
            </form.Field>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Media Files</h3>

              {/* Poster Image */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Poster Image</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("posterImage", e.target.files?.[0] || null)}
                    className="hidden"
                    id="poster-upload"
                  />
                  <label htmlFor="poster-upload" className="cursor-pointer">
                    <div className="w-32 h-48 border-2 border-dashed rounded-lg flex items-center justify-center hover:border-primary">
                      {posterPreview ? (
                        <img src={posterPreview} alt="Poster preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                  </label>
                  {posterPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPosterPreview(null);
                        form.setFieldValue("posterImage", null);
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              {/* Trailer Video URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Trailer Video URL (optional)</label>
                <form.Field name="trailerVideo">
                  {(field) => (
                    <AppField
                      field={field}
                      label="Trailer URL"
                      type="url"
                      placeholder="https://example.com/video.mp4"
                    />
                  )}
                </form.Field>
              </div>

              {/* Streaming Video URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Streaming Video URL</label>
                <form.Field name="streamingVideo">
                  {(field) => (
                    <AppField
                      field={field}
                      label="Streaming URL"
                      type="url"
                      placeholder="https://example.com/video.mp4"
                      required
                    />
                  )}
                </form.Field>
              </div>
            </div>

            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel={isEditing ? "Updating Content..." : "Creating Content..."}
                  disabled={!canSubmit}
                >
                  {isEditing ? "Update Content" : "Create Content"}
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddContentPage;