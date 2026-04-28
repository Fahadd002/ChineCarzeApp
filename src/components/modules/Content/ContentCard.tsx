import Image from "next/image";
import Link from "next/link";
import { IContent } from "@/types/content.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Star, Eye, Pencil, Trash2, Film } from "lucide-react";
import { useRouter } from "next/navigation";

interface ContentCardProps {
  content: IContent;
  showWatchButton?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ContentCard({ content, showWatchButton = false, onEdit, onDelete }: ContentCardProps) {
  const router = useRouter();

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


  // Determine if "Watch Now" should be shown (only for FREE content or when showWatchButton is true)
  const showWatchNow = showWatchButton || content.accessType === "FREE";

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-[2/3] overflow-hidden">
          {content.posterUrl ? (
            <Image
              src={content.posterUrl}
              alt={content.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}

          {/* Overlay with action buttons on hover */}
          <div className="absolute inset-0 bg-black/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col items-center justify-center gap-3 p-4">
            {/* Watch Now button (context-aware) */}
            {showWatchNow && (
              <Button asChild size="lg" className="rounded-full w-full max-w-[200px]">
                <Link href={`/content/${content.id}/watch`}>
                  <Play className="h-5 w-5 mr-2" />
                  Watch Now
                </Link>
              </Button>
            )}
          </div>

          {/* Access type badge */}
          <div className="absolute top-2 left-2">
            <Badge variant={content.accessType === "FREE" ? "secondary" : "default"}>
              {content.accessType}
            </Badge>
          </div>

          {/* Media type badge */}
          <div className="absolute top-2 right-2">
            <Badge variant="outline">
              {content.mediaType.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <CardTitle className="line-clamp-2 text-lg">{content.title}</CardTitle>

        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{content.releaseYear}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{content.views}</span>
          </div>
        </div>

        {content.genres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {content.genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
        )}

        {content.description && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {content.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex w-full gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/content/${content.id}`}>
              View Details
            </Link>
          </Button>

          {content.accessType === "TICKET" && (
            <Button asChild className="flex-1">
              <Link href={`/dashboard/buy-ticket?contentId=${content.id}`}>
                Buy Ticket
              </Link>
            </Button>
          )}

          {content.accessType === "FREE" && (
            <Button asChild className="flex-1">
              <Link href={`/content/${content.id}/watch`}>
                Watch Now
              </Link>
            </Button>
          )}
        </div>

        {(onEdit || onDelete) && (
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleEdit}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}