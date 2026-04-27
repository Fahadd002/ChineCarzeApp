/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyTickets } from "@/services/ticket.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import Link from "next/link";

const PurchaseHistoryPage = () => {
  const { data: ticketsData, isLoading, error } = useQuery({
    queryKey: ["my-tickets"],
    queryFn: getMyTickets,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
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
            <CardTitle>Purchase History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">Failed to load purchase history. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tickets = ticketsData?.data || [];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PAID":
        return "default";
      case "PENDING":
        return "secondary";
      case "FAILED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length > 0 ? (
            <div className="space-y-4">
              {tickets.map((ticket: any) => {
                const status = ticket.paymentStatus ?? "PENDING";
                const amount = ticket.payment?.amount ?? 0;
                return (
                  <div key={ticket.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{ticket.content.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {ticket.content.mediaType?.replace("_", " ")} • {ticket.content.releaseYear}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">
                            ${amount.toFixed(2)}
                          </Badge>
                          <Badge variant={getStatusBadgeVariant(status)}>
                            {status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Purchased</p>
                        <p className="text-sm">
                          {format(new Date(ticket.purchasedAt), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">You have not purchased any tickets yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseHistoryPage;