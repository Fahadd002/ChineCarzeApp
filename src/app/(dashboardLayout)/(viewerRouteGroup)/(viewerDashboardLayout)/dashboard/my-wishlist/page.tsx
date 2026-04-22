
"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyWatchlist } from "@/services/watchlist.services";
import { ContentGrid } from "@/components/modules/Content/ContentGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const MyWishlistPage = () => {
  const { data: watchlist, isLoading, error } = useQuery({
    queryKey: ["my-watchlist"],
    queryFn: getMyWatchlist,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Wishlist</CardTitle>
          </CardHeader>
          <CardContent>
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
        <Card>
          <CardHeader>
            <CardTitle>My Wishlist</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">Failed to load wishlist. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Wishlist</CardTitle>
        </CardHeader>
        <CardContent>
          {watchlist && watchlist.data && watchlist.data.length > 0 ? (
            <ContentGrid contents={watchlist.data.map((item) => item.content as any)} />
          ) : (
            <p className="text-muted-foreground">Your wishlist is empty.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyWishlistPage;