/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getMySubscriptions } from "@/services/subscription.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const MySubscriptionsPage = () => {
  const router = useRouter();
  const { data: subscriptions, isLoading, error } = useQuery({
    queryKey: ["my-subscriptions"],
    queryFn: getMySubscriptions,
  });

  const handleGetSubscription = () => {
    router.push("/payment/checkout");
  };

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
        <CardHeader className="flex justify-between items-center flex-row">
          <CardTitle>My Subscriptions</CardTitle>
          <Button onClick={handleGetSubscription} className="bg-primary hover:bg-primary/90">
            Get Subscription
          </Button>
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
            <div className="flex justify-between items-center py-6">
              <p className="text-muted-foreground">You have no active subscriptions.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MySubscriptionsPage;