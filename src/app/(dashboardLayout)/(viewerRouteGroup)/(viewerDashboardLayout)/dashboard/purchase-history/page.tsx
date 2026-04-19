"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyTickets } from "@/services/ticket.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const PurchaseHistoryPage = () => {
  const { data: tickets, isLoading, error } = useQuery({
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets && tickets.data && tickets.data.length > 0 ? (
            <div className="space-y-4">
              {tickets.data.map((ticket: any) => (
                <div key={ticket.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{ticket.content.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {ticket.content.mediaType} • {ticket.content.releaseYear}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">
                          ${ticket.price}
                        </Badge>
                        <Badge
                          variant={
                            ticket.status === "active"
                              ? "default"
                              : ticket.status === "expired"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Purchased</p>
                      <p className="text-sm">
                        {format(new Date(ticket.purchaseDate), "MMM dd, yyyy")}
                      </p>
                      {ticket.expiryDate && (
                        <>
                          <p className="text-sm text-muted-foreground mt-1">
                            {ticket.status === "expired" ? "Expired" : "Expires"}
                          </p>
                          <p className="text-sm">
                            {format(new Date(ticket.expiryDate), "MMM dd, yyyy")}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">You haven't purchased any tickets yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseHistoryPage;