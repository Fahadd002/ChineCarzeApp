/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { getMySubscriptions } from "@/services/subscription.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const MySubscriptionsPage = () => {
  const { data: subscriptions, isLoading, error } = useQuery({
    queryKey: ["my-subscriptions"],
    queryFn: getMySubscriptions,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
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
            <CardTitle>My Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">Failed to load subscriptions. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptions && subscriptions.data && subscriptions.data.length > 0 ? (
            <div className="space-y-4">
              {subscriptions.data.map((subscription: any) => (
                <div key={subscription.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{subscription.planName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {subscription.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">
                          ${subscription.price}/{subscription.billingCycle}
                        </Badge>
                        <Badge
                          variant={subscription.status === "active" ? "default" : "secondary"}
                        >
                          {subscription.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Started</p>
                      <p className="text-sm">
                        {format(new Date(subscription.startDate), "MMM dd, yyyy")}
                      </p>
                      {subscription.endDate && (
                        <>
                          <p className="text-sm text-muted-foreground mt-1">Ends</p>
                          <p className="text-sm">
                            {format(new Date(subscription.endDate), "MMM dd, yyyy")}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">You have no active subscriptions.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MySubscriptionsPage;