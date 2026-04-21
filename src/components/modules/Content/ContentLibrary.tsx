"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllContents } from "@/services/content.services";
import { ContentGrid } from "./ContentGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Filter, 
  X, 
  Film, 
  Tv, 
  TrendingUp,
  LayoutGrid,
  List,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const availableGenres = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", 
  "Documentary", "Drama", "Fantasy", "Horror", "Mystery", 
  "Romance", "Sci-Fi", "Thriller", "War", "Western"
];

const releaseYears = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

export function ContentLibrary() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMediaType, setSelectedMediaType] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["search-contents", searchTerm, selectedGenres, selectedMediaType, selectedYear, sortBy, sortOrder, priceRange],
    queryFn: () => getAllContents({
      limit: 20,
      searchTerm: searchTerm || undefined,
      genre: selectedGenres.length > 0 ? selectedGenres.join(",") : undefined,
      mediaType: selectedMediaType || undefined,
      releaseYear: selectedYear || undefined,
      sortBy,
      sortOrder,
    }),
  });

  const contents = useMemo(() => data?.data || [], [data]);
  const totalCount = data?.meta?.total || 0;

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedGenres([]);
    setSelectedMediaType("");
    setSelectedYear(null);
    setSortBy("createdAt");
    setSortOrder("desc");
    setPriceRange([0, 100]);
  };

  const hasActiveFilters = searchTerm || selectedGenres.length > 0 || selectedMediaType || selectedYear;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black">
      {/* Hero Section with Gradient Overlay */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600/20 via-red-500/10 to-transparent border-b border-red-500/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1920')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-500 via-red-400 to-white bg-clip-text text-transparent mb-4">
              Content Library
            </h1>
            <p className="text-xl text-gray-300">
              Discover thousands of movies, TV shows, and exclusive content
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Search Bar */}
        <Card className="mb-8 shadow-2xl border-0 bg-gradient-to-r from-zinc-900/95 to-zinc-800/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/80">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, director, or cast..."
                  className="pl-10 h-12 text-base bg-zinc-800/50 border-zinc-700 focus:border-red-500 focus:ring-red-500/20 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div className="flex gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="lg" className="gap-2 bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white">
                      <Filter className="h-4 w-4" />
                      Filters
                      {hasActiveFilters && (
                        <Badge variant="secondary" className="ml-2 bg-red-500 text-white">
                          {selectedGenres.length + (selectedMediaType ? 1 : 0) + (selectedYear ? 1 : 0) + (searchTerm ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto bg-zinc-900 border-zinc-800">
                    <SheetHeader>
                      <SheetTitle className="text-white">Filter Content</SheetTitle>
                      <SheetDescription className="text-gray-400">
                        Refine your search with advanced filters
                      </SheetDescription>
                    </SheetHeader>
                    <Separator className="my-4 bg-zinc-800" />
                    
                    <div className="space-y-6">
                      {/* Genre Filter - Multiple Selection */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block text-white">Genres</Label>
                        <div className="flex flex-wrap gap-2">
                          {availableGenres.map((genre) => (
                            <Badge
                              key={genre}
                              variant={selectedGenres.includes(genre) ? "default" : "outline"}
                              className={`cursor-pointer hover:scale-105 transition-all px-3 py-1.5 text-sm ${
                                selectedGenres.includes(genre) 
                                  ? "bg-red-500 text-white hover:bg-red-600" 
                                  : "bg-zinc-800 text-gray-300 border-zinc-700 hover:bg-zinc-700"
                              }`}
                              onClick={() => toggleGenre(genre)}
                            >
                              {genre}
                            </Badge>
                          ))}
                        </div>
                        {selectedGenres.length > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedGenres([])}
                            className="mt-3 text-gray-400 hover:text-red-500"
                          >
                            Clear all genres
                          </Button>
                        )}
                      </div>

                      <Separator className="bg-zinc-800" />

                      {/* Media Type */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block text-white">Content Type</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant={selectedMediaType === "MOVIE" ? "default" : "outline"}
                            className={`justify-start gap-2 h-12 ${
                              selectedMediaType === "MOVIE" 
                                ? "bg-red-500 hover:bg-red-600" 
                                : "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                            }`}
                            onClick={() => setSelectedMediaType(selectedMediaType === "MOVIE" ? "" : "MOVIE")}
                          >
                            <Film className="h-4 w-4" />
                            Movies
                          </Button>
                          <Button
                            variant={selectedMediaType === "TV_SERIES" ? "default" : "outline"}
                            className={`justify-start gap-2 h-12 ${
                              selectedMediaType === "TV_SERIES" 
                                ? "bg-red-500 hover:bg-red-600" 
                                : "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                            }`}
                            onClick={() => setSelectedMediaType(selectedMediaType === "TV_SERIES" ? "" : "TV_SERIES")}
                          >
                            <Tv className="h-4 w-4" />
                            TV Series
                          </Button>
                        </div>
                      </div>

                      <Separator className="bg-zinc-800" />

                      {/* Release Year */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block text-white">Release Year</Label>
                        <select
                          value={selectedYear || ""}
                          onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                          <option value="">All Years</option>
                          {releaseYears.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Separator className="bg-zinc-800" />

                      {/* Price Range */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block text-white">Price Range ($)</Label>
                        <Slider
                          min={0}
                          max={100}
                          step={5}
                          value={priceRange}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                          className="mt-2"
                        />
                        <div className="flex justify-between mt-2 text-sm text-gray-400">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}+</span>
                        </div>
                      </div>
                    </div>

                    <div className="sticky bottom-0 bg-zinc-900 pt-4 mt-6">
                      <Button onClick={clearAllFilters} variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800">
                        Clear All Filters
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="lg" className="gap-2 bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-700">
                      <TrendingUp className="h-4 w-4" />
                      Sort
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-zinc-800 border-zinc-700">
                    <DropdownMenuItem onClick={() => { setSortBy("createdAt"); setSortOrder("desc"); }} className="text-white hover:bg-zinc-700">
                      Latest Added
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSortBy("releaseYear"); setSortOrder("desc"); }} className="text-white hover:bg-zinc-700">
                      Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSortBy("releaseYear"); setSortOrder("asc"); }} className="text-white hover:bg-zinc-700">
                      Oldest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSortBy("title"); setSortOrder("asc"); }} className="text-white hover:bg-zinc-700">
                      Title A-Z
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSortBy("views"); setSortOrder("desc"); }} className="text-white hover:bg-zinc-700">
                      Most Viewed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex gap-1 border border-zinc-700 rounded-lg p-1 bg-zinc-800/50">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-red-500 hover:bg-red-600" : "text-white hover:bg-zinc-700"}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-red-500 hover:bg-red-600" : "text-white hover:bg-zinc-700"}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-800">
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1 bg-zinc-800 text-gray-300">
                    Search: {searchTerm}
                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setSearchTerm("")} />
                  </Badge>
                )}
                {selectedGenres.map((genre) => (
                  <Badge key={genre} variant="secondary" className="gap-1 bg-red-500/20 text-red-400 border-red-500/30">
                    {genre}
                    <X className="h-3 w-3 cursor-pointer hover:text-red-300" onClick={() => toggleGenre(genre)} />
                  </Badge>
                ))}
                {selectedMediaType && (
                  <Badge variant="secondary" className="gap-1 bg-zinc-800 text-gray-300">
                    Type: {selectedMediaType.replace("_", " ")}
                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setSelectedMediaType("")} />
                  </Badge>
                )}
                {selectedYear && (
                  <Badge variant="secondary" className="gap-1 bg-zinc-800 text-gray-300">
                    Year: {selectedYear}
                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => setSelectedYear(null)} />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 text-xs text-gray-400 hover:text-red-500">
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Stats */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isLoading ? "Loading..." : `${totalCount} Content${totalCount !== 1 ? "s" : ""}`}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {hasActiveFilters ? "Filtered results" : "All available content"}
            </p>
          </div>
          {isFetching && !isLoading && (
            <Badge variant="outline" className="animate-pulse bg-red-500/10 text-red-400 border-red-500/30">
              Updating...
            </Badge>
          )}
        </div>

        {/* Content Display */}
        {isLoading ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            : "space-y-4"
          }>
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-80 w-full rounded-xl bg-zinc-800" />
            ))}
          </div>
        ) : error ? (
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-red-400 font-medium mb-4">
                Failed to load content. Please try again.
              </p>
              <Button onClick={() => refetch()} variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ContentGrid 
            contents={contents} 
            viewMode={viewMode}
            emptyMessage={
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No content found matching your criteria</p>
                <Button onClick={clearAllFilters} variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                  Clear Filters
                </Button>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}