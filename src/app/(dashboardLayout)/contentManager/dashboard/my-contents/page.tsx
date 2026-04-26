"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyContents, deleteContent } from "@/services/content.services";
import { ContentGrid } from "@/components/modules/Content/ContentGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const MyContentsPage = () => {
  const queryClient = useQueryClient();
  const { data: contents, isLoading, error } = useQuery({
    queryKey: ["my-contents"],
    queryFn: getMyContents,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContent,
    onSuccess: () => {
      toast.success("Content deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["my-contents"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete content");
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Contents</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Contents</h1>
          <Button asChild>
            <Link href="/contentManager/dashboard/add-content">
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Failed to load contents. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Contents</h1>
        <Button asChild>
          <Link href="/contentManager/dashboard/add-content">
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {contents && contents.data && contents.data.length > 0 ? (
            <ContentGrid 
              contents={contents.data} 
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven't added any content yet.</p>
              <Button asChild>
                <Link href="/contentManager/dashboard/add-content">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Content
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyContentsPage;