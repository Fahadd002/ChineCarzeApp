import { IContent } from "@/types/content.types";
import { ContentCard } from "./ContentCard";

interface ContentGridProps {
  contents: IContent[];
  showWatchButton?: boolean;
  emptyMessage?: string;
}

export function ContentGrid({
  contents,
  showWatchButton = false,
  emptyMessage = "No content available"
}: ContentGridProps) {
  if (contents.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {contents.map((content) => (
        <ContentCard
          key={content.id}
          content={content}
          showWatchButton={showWatchButton}
        />
      ))}
    </div>
  );
}