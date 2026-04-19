"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllContents } from "@/services/content.services";
import { ContentGrid } from "./ContentGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

const availableGenres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western",
];

export function ContentLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["search-contents", searchTerm, selectedGenre, selectedMediaType],
    queryFn: () => getAllContents({
      limit: 20,
      search: searchTerm || undefined,
      genre: selectedGenre || undefined,
      mediaType: selectedMediaType || undefined,
    }),
  });

  const contents = useMemo(() => data?.data || [], [data]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Browse Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search titles, genres, or keywords"
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  <option value="">All genres</option>
                  {availableGenres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedMediaType}
                  onChange={(e) => setSelectedMediaType(e.target.value)}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  <option value="">All media types</option>
                  <option value="MOVIE">Movie</option>
                  <option value="TV_SHOW">TV Show</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedGenre && (
                  <Badge variant="secondary">
                    Genre: {selectedGenre}
                    <button type="button" className="ml-2" onClick={() => setSelectedGenre("")}>×</button>
                  </Badge>
                )}
                {selectedMediaType && (
                  <Badge variant="secondary">
                    Media: {selectedMediaType.replace("_", " ")}
                    <button type="button" className="ml-2" onClick={() => setSelectedMediaType("")}>×</button>
                  </Badge>
                )}
              </div>

              <Button variant="outline" onClick={() => refetch()}>
                Refresh search
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Popular genres</h3>
              <div className="flex flex-wrap gap-2">
                {availableGenres.slice(0, 8).map((genre) => (
                  <Badge
                    key={genre}
                    variant={selectedGenre === genre ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedGenre(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-64 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border bg-destructive/10 p-6 text-destructive">
          Something went wrong while fetching contents.
        </div>
      ) : (
        <ContentGrid contents={contents} emptyMessage="No matching content found" />
      )}
    </div>
  );
}
