/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getSubscriptionPlans, createCheckoutSession } from "@/services/payment.services";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const CheckoutPage = () => {
  const { data: plans, isLoading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: getSubscriptionPlans,
  });

  const { mutateAsync: createSession, isPending } = useMutation({
    mutationFn: (payload: { plan: string }) =>
      createCheckoutSession({ type: "SUBSCRIPTION", plan: payload.plan as any }),
  });

  const handleCheckout = async (plan: string) => {
    try {
      const response = await createSession({ plan });

      if (response.success && response.data?.url) {
        
      } else {
        toast.error(response.message || "Failed to start checkout");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Unable to start checkout");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Subscribe to CineCraze</h1>
          <p className="text-muted-foreground mt-2">
            Choose a subscription plan to unlock unlimited streaming and premium ticket access.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-40 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans?.data?.map((plan: any) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">${plan.price.toFixed(2)}</span>
                    <Badge variant="secondary">{plan.billingCycle}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                    {plan.features?.map((feature: string) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={isPending}
                    className="w-full"
                  >
                    {isPending ? "Redirecting..." : "Start Checkout"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;