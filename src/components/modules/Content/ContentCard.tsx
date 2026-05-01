/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IContent } from "@/types/content.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Star, Eye, Pencil, Trash2, Film, Calendar, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createCheckoutSession } from "@/services/ticket.services";
import { toast } from "sonner";

interface ContentCardProps {
  content: IContent;
  showWatchButton?: boolean;
  hasAccess?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  index?: number;
  onTicketPurchase?: () => void; // Callback to refresh parent data after purchase
}

export function ContentCard({
  content,
  showWatchButton = false,
  hasAccess = false,
  onEdit,
  onDelete,
  index = 0,
  onTicketPurchase,
}: ContentCardProps) {
  const router = useRouter();
  const [isPurchasingTicket, setIsPurchasingTicket] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(content.id);
    } else {
      router.push(`/contentManager/dashboard/add-content?id=${content.id}`);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(content.id);
    }
  };

  const handleBuyTicket = async () => {
    setIsPurchasingTicket(true);
    try {
      const sessionResponse = await createCheckoutSession(content.id);
      
      if (!sessionResponse.success) {
        const message = sessionResponse.message || "Failed to create checkout session";
        
        // Check if already purchased
        if (message.toLowerCase().includes("already purchased") || 
            message.toLowerCase().includes("already have a ticket")) {
          toast.info("You already have a ticket for this content");
          onTicketPurchase?.(); // Refresh parent data
          return;
        }
        
        throw new Error(message);
      }
      
      // Check if we have the redirect URL
      if (!sessionResponse.data?.url) {
        throw new Error("No checkout URL received from server");
      }
      
      // Redirect to Stripe checkout
      window.location.href = sessionResponse.data.url;
      
    } catch (error: any) {
      console.error("Payment error:", error);
      
      let errorMessage = "Failed to initiate payment. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Check for "already purchased" in error message
      if (errorMessage.toLowerCase().includes("already purchased") || 
          errorMessage.toLowerCase().includes("already have a ticket")) {
        toast.info("You already have a ticket for this content");
        onTicketPurchase?.(); // Refresh parent data
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsPurchasingTicket(false);
    }
  };

  // Improved watch button logic
  const showWatchNow = showWatchButton || 
    content.accessType === "FREE" || 
    (hasAccess && (content.accessType === "SUBSCRIPTION" || content.accessType === "TICKET" || content.accessType === "BOTH"));

   // Show ticket button only for TICKET or BOTH without access
   const showTicketButton = (content.accessType === "TICKET" || content.accessType === "BOTH") && !hasAccess;

  const glowColor =
    content.accessType === "FREE"
      ? "green"
      : content.accessType === "SUBSCRIPTION"
      ? "blue"
      : "red";

  const averageRating = content.reviews && content.reviews.length > 0
    ? content.reviews.reduce((sum, review) => sum + review.rating, 0) / content.reviews.length
    : 0;

  // Format ticket price for display
  const ticketPrice = content.ticketPrice ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{
        scale: 1.03,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-900/95 to-zinc-900/80 backdrop-blur-sm border border-white/5 shadow-card transition-all duration-500 hover:shadow-elevated hover:border-white/10"
    >
      <motion.div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none blur-2xl",
          glowColor === "red" && "bg-gradient-to-br from-red-600/30 to-transparent",
          glowColor === "blue" && "bg-gradient-to-br from-blue-600/30 to-transparent",
          glowColor === "green" && "bg-gradient-to-br from-emerald-600/30 to-transparent"
        )}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-2xl ring-2 ring-primary/0 opacity-0 z-20 pointer-events-none"
        whileHover={{ opacity: 0.2 }}
        transition={{ duration: 0.2 }}
      />

      {/* Poster Section */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {content.posterUrl ? (
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Image
              src={content.posterUrl}
              alt={content.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </motion.div>
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <Film className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

        {/* Media type badge */}
        <div className="absolute top-2 right-2 z-10">
          <Badge
            variant="outline"
            className="bg-black/70 text-white border-white/20 backdrop-blur-sm text-xs"
          >
            {content.mediaType.replace("_", " ")}
          </Badge>
        </div>

        {/* Rating badge */}
        {averageRating > 0 && (
          <div className="absolute bottom-2 left-2 z-10">
            <Badge
              variant="default"
              className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-white flex items-center gap-1 backdrop-blur-sm"
            >
              <Star className="h-3 w-3 fill-white" />
              {averageRating.toFixed(1)}
            </Badge>
          </div>
        )}

        {/* Access type indicator */}
        <div className="absolute bottom-2 right-2 z-10">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Badge
              className={cn(
                "backdrop-blur-sm border-0 text-xs font-semibold",
                content.accessType === "FREE"
                  ? "bg-emerald-500/90 text-white"
                  : content.accessType === "SUBSCRIPTION"
                  ? "bg-blue-500/90 text-white"
                  : "bg-rose-500/90 text-white"
              )}
            >
              {content.accessType === "BOTH"
                ? "SUB+TICKET"
                : content.accessType === "FREE"
                ? "FREE"
                : content.accessType === "SUBSCRIPTION"
                ? "SUB"
                : "TICKET"}
            </Badge>
          </motion.div>
        </div>

        {/* Play button overlay with pointer-events-none */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          initial={false}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative pointer-events-auto"
          >
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl" />
            <Button
              asChild
              size="icon"
              className="relative h-16 w-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 border-none shadow-lg hover:shadow-red-500/50"
            >
              <Link href={`/content/${content.id}/watch`}>
                <Play className="h-8 w-8 fill-white ml-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Content Info */}
      <div className="relative p-4 space-y-3">
        <motion.h3
          className="line-clamp-2 text-lg font-semibold leading-tight text-foreground group-hover:text-primary/90 transition-colors"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          {content.title}
        </motion.h3>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {content.releaseYear}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {(content.views || 0).toLocaleString()}
          </span>
        </div>

        {content.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {content.genres.slice(0, 3).map((genre) => (
              <motion.div
                key={genre}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Badge
                  variant="outline"
                  className="text-xs border-white/10 hover:border-white/30 transition-colors cursor-default"
                >
                  {genre}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}

        {content.description && (
          <motion.p
            className="line-clamp-2 text-xs text-muted-foreground leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {content.description}
          </motion.p>
        )}
      </div>

      {/* Action Buttons */}
      <motion.div
        className="p-4 pt-0 flex flex-col gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex w-full gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 border-white/10 hover:bg-white/5 hover:border-white/20 transition-all"
          >
            <Link href={`/content/${content.id}`}>Details</Link>
          </Button>

          {showWatchNow && (
            <Button asChild size="sm" className="flex-1 bg-red-600 hover:bg-red-700 border-0">
              <Link href={`/content/${content.id}/watch`}>
                <Play className="h-3 w-3 mr-1 fill-white" />
                Watch
              </Link>
            </Button>
          )}
        </div>

        {showTicketButton && (
          <Button
            onClick={handleBuyTicket}
            disabled={isPurchasingTicket}
            size="sm"
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 border-0 shadow-lg"
          >
            {isPurchasingTicket ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Processing...
              </>
            ) : (
              <>Buy Ticket {ticketPrice > 0 && `- $${ticketPrice.toFixed(2)}`}</>
            )}
          </Button>
        )}

        {(onEdit || onDelete) && (
          <div className="flex w-full gap-2 pt-2 border-t border-white/5 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 hover:bg-white/5 text-muted-foreground hover:text-foreground"
              onClick={handleEdit}
            >
              <Pencil className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 hover:bg-red-500/10 text-red-400 hover:text-red-300"
              onClick={handleDelete}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </motion.div>

      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br from-red-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-red-500/20 group-hover:via-purple-500/20 group-hover:to-blue-500/20 transition-all duration-500" />
      </div>
    </motion.div>
  );
}