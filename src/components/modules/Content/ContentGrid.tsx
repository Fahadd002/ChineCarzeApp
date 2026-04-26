import { IContent } from "@/types/content.types";
import { ContentCard } from "./ContentCard";

// ContentGrid.tsx
interface ContentGridProps {
  contents: IContent[];
  viewMode?: "grid" | "list";
  emptyMessage?: React.ReactNode;
  onDelete?: (id: string) => void;
}

export function ContentGrid({ contents, viewMode = "grid", emptyMessage, onDelete }: ContentGridProps) {
  if (contents.length === 0) {
    return emptyMessage ? <>{emptyMessage}</> : null;
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {contents.map((content) => (
          <ContentCard key={content.id} content={content} showWatchButton onDelete={onDelete} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {contents.map((content) => (
        <ContentCard key={content.id} content={content} showWatchButton onDelete={onDelete} />
      ))}
    </div>
  );
}