import { ContentLibrary } from "@/components/modules/Content/ContentLibrary";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome to CineCraze</h1>
        <p className="text-muted-foreground mt-2">
          Explore movies, TV shows, reviews, ticket purchases, and premium subscriptions.
        </p>
      </div>

      <ContentLibrary />
    </div>
  );
}
