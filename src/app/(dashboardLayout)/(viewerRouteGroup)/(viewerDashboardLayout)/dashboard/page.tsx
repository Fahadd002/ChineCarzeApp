"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllContents } from "@/services/content.services";
import { getMyWatchlist } from "@/services/watchlist.services";
import { getMySubscriptions } from "@/services/subscription.services";
import { getMyTickets } from "@/services/ticket.services";
import { ContentGrid } from "@/components/modules/Content/ContentGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ViewerDashboardPage = () => {
  const { data: contents, isLoading: contentsLoading } = useQuery({
    queryKey: ["featured-contents"],
    queryFn: () => getAllContents({ limit: 8 }),
  });

  const { data: watchlist } = useQuery({
    queryKey: ["my-watchlist"],
    queryFn: getMyWatchlist,
  });

  const { data: subscriptions } = useQuery({
    queryKey: ["my-subscriptions"],
    queryFn: getMySubscriptions,
  });

  const { data: tickets } = useQuery({
    queryKey: ["my-tickets"],
    queryFn: getMyTickets,
  });

  const watchlistCount = watchlist?.data?.length || 0;
  const subscriptionCount = subscriptions?.data?.length || 0;
  const ticketCount = tickets?.data?.length || 0;
  const featuredContents = contents?.data || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Stream your favorite movies, manage your watchlist, and keep track of your subscriptions.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Watchlist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{watchlistCount}</div>
              <p className="text-sm text-muted-foreground">Saved titles</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{subscriptionCount}</div>
              <p className="text-sm text-muted-foreground">Active plans</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{ticketCount}</div>
              <p className="text-sm text-muted-foreground">Purchased passes</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recommended For You</h2>
          <p className="text-sm text-muted-foreground">Browse the latest trending titles</p>
        </div>

        {contentsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full" />
            ))}
          </div>
        ) : (
          <ContentGrid contents={featuredContents} />
        )}
      </div>
    </div>
  );
};

export default ViewerDashboardPage;