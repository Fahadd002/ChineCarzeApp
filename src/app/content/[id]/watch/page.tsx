"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getContentById } from "@/services/content.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const WatchPage = () => {
  const params = useParams();
  const contentId = params.id as string;

  const { data: content, isLoading, error } = useQuery({
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

  if (error || !content?.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-500">Content not found or access denied.</p>
            <Button asChild className="mt-4">
              <Link href={`/content/${contentId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Details
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const contentData = content.data;

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
          <CardTitle>{contentData.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {contentData.videoUrl ? (
            <div className="aspect-video">
              <video
                src={contentData.videoUrl}
                controls
                className="h-full w-full rounded-lg"
                poster={contentData.posterUrl}
              >
                Your browser does not support the video tag.
              </video>
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