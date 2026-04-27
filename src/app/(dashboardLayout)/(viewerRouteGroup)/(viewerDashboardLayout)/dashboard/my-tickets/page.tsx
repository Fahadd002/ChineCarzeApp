"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyTickets } from "@/services/ticket.services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Ticket as TicketIcon, Calendar, Film } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

const MyTicketsPage = () => {
  const { data: ticketsData, isLoading, error } = useQuery({
    queryKey: ["my-tickets"],
    queryFn: getMyTickets,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Tickets</h1>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
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
        <h1 className="text-2xl font-bold">My Tickets</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Failed to load tickets. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tickets = ticketsData?.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Tickets</h1>

      {tickets.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <TicketIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No tickets purchased yet</p>
            <p className="text-muted-foreground mb-4">
              Purchase a ticket to unlock premium content.
            </p>
            <Button asChild>
              <Link href="/content">Browse Content</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const paymentStatus = ticket.paymentStatus ?? "PENDING";
            return (
              <Card key={ticket.id} className={paymentStatus === "PAID" ? "border-green-200" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {ticket.content.posterUrl && (
                      <img
                        src={ticket.content.posterUrl}
                        alt={ticket.content.title}
                        className="w-20 h-28 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{ticket.content.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {ticket.content.releaseYear} • {ticket.content.mediaType.replace("_", " ")}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              paymentStatus === "PAID"
                                ? "bg-green-100 text-green-800"
                                : paymentStatus === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {paymentStatus === "PAID" ? "✓ Active" : paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Purchased: {format(new Date(ticket.purchasedAt), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Film className="h-4 w-4 text-muted-foreground" />
                          <span>Access: {ticket.content.accessType}</span>
                        </div>
                      </div>

                      {paymentStatus === "PAID" && (
                        <div className="mt-4">
                          <Button asChild size="sm">
                            <Link href={`/content/${ticket.content.id}/watch`}>
                              Watch Now
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
