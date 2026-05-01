"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllContents } from "@/services/content.services";
import { ContentGrid } from "./ContentGrid";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShimmerSkeleton } from "@/components/ui/motion";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  Film,
  Tv,
  LayoutGrid,
  List,
  ChevronDown,
  Heart,
  ArrowUpDown,
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
import { AnimatedButton } from "@/components/ui/motion";
import { FloatingOrb } from "@/components/ui/motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

  const activeFilterCount = (searchTerm ? 1 : 0) + selectedGenres.length + (selectedMediaType ? 1 : 0) + (selectedYear ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-[#0a0a0f] to-black">
      {/* Compact Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden border-b border-white/5"
      >
        {/* Simplified gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-purple-950/10 to-transparent" />
        
        {/* Single floating orb for visual interest */}
        <FloatingOrb color="red" size="sm" className="top-5 right-5 opacity-30" />

        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title Section */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <div className="h-8 w-1 bg-gradient-to-b from-red-500 to-purple-500 rounded-full" />
                <h1 className="text-2xl md:text-3xl font-bold">
                  <span className="bg-gradient-to-r from-red-400 via-purple-400 to-white bg-clip-text text-transparent">
                    Content Library
                  </span>
                </h1>
                <Badge variant="outline" className="border-white/10 text-xs">
                  {totalCount} Titles
                </Badge>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-muted-foreground mt-1 ml-4"
              >
                Discover and stream the best content
              </motion.p>
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 text-sm"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-sm">
                <Film className="h-3.5 w-3.5 text-red-400" />
                <span className="text-xs text-muted-foreground">Movies</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-sm">
                <Tv className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-muted-foreground">Series</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-sm">
                <Heart className="h-3.5 w-3.5 text-rose-400" />
                <span className="text-xs text-muted-foreground">4K+</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main Content - More Compact */}
      <div className="container mx-auto px-4 py-6">
        {/* Search & Filters Bar - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Search input - Compact */}
                <div className="flex-1 relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-red-500 transition-colors" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, director, cast..."
                    className="pl-9 h-10 text-sm bg-zinc-950/50 border-white/10 focus:border-red-500/50 focus:ring-red-500/20 rounded-lg transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  {/* Mobile Filter Sheet - Compact */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-white/10 bg-zinc-950/50 hover:bg-zinc-900 h-10"
                      >
                        <Filter className="h-4 w-4" />
                        Filters
                        {activeFilterCount > 0 && (
                          <span className="ml-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                            {activeFilterCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[380px] overflow-y-auto bg-zinc-950/95 backdrop-blur-xl border-white/10 p-0">
                      <SheetHeader className="p-6 pb-0">
                        <SheetTitle className="flex items-center gap-2">
                          <Filter className="h-5 w-5 text-red-500" />
                          <span>Filters</span>
                        </SheetTitle>
                        <SheetDescription>
                          Refine your search results
                        </SheetDescription>
                      </SheetHeader>
                      
                      <div className="p-6 space-y-6">
                        {/* Genre Filter - Compact */}
                        <div>
                          <Label className="text-sm font-semibold mb-3 block">Genres</Label>
                          <div className="flex flex-wrap gap-1.5">
                            {availableGenres.map((genre) => {
                              const isSelected = selectedGenres.includes(genre);
                              return (
                                <Badge
                                  key={genre}
                                  variant={isSelected ? "default" : "outline"}
                                  className={cn(
                                    "cursor-pointer transition-all px-2.5 py-1 text-xs",
                                    isSelected
                                      ? "bg-gradient-to-r from-red-500 to-red-600 border-0"
                                      : "bg-zinc-900 border-white/10 hover:border-white/30"
                                  )}
                                  onClick={() => toggleGenre(genre)}
                                >
                                  {genre}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Media Type - Compact */}
                        <div>
                          <Label className="text-sm font-semibold mb-3 block">Content Type</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant={selectedMediaType === "MOVIE" ? "default" : "outline"}
                              size="sm"
                              className={`gap-2 h-9 text-sm ${
                                selectedMediaType === "MOVIE"
                                  ? "bg-gradient-to-r from-red-600 to-red-700"
                                  : "bg-zinc-900 border-white/10"
                              }`}
                              onClick={() => setSelectedMediaType(selectedMediaType === "MOVIE" ? "" : "MOVIE")}
                            >
                              <Film className="h-3.5 w-3.5" />
                              Movies
                            </Button>
                            <Button
                              variant={selectedMediaType === "TV_SERIES" ? "default" : "outline"}
                              size="sm"
                              className={`gap-2 h-9 text-sm ${
                                selectedMediaType === "TV_SERIES"
                                  ? "bg-gradient-to-r from-purple-600 to-purple-700"
                                  : "bg-zinc-900 border-white/10"
                              }`}
                              onClick={() => setSelectedMediaType(selectedMediaType === "TV_SERIES" ? "" : "TV_SERIES")}
                            >
                              <Tv className="h-3.5 w-3.5" />
                              TV Series
                            </Button>
                          </div>
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Release Year - Compact */}
                        <div>
                          <Label className="text-sm font-semibold mb-3 block">Release Year</Label>
                          <select
                            value={selectedYear || ""}
                            onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                          >
                            <option value="">All Years</option>
                            {releaseYears.map((year) => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Price Range - Compact */}
                        <div>
                          <Label className="text-sm font-semibold mb-3 block">Price Range ($)</Label>
                          <Slider
                            min={0}
                            max={100}
                            step={5}
                            value={priceRange}
                            onValueChange={(value) => setPriceRange(value as [number, number])}
                            className="mt-2"
                          />
                          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>${priceRange[0]}</span>
                            <span>${priceRange[1]}+</span>
                          </div>
                        </div>
                      </div>

                      <div className="sticky bottom-0 bg-zinc-950/95 backdrop-blur-xl p-4 border-t border-white/10">
                        <Button onClick={clearAllFilters} variant="outline" size="sm" className="w-full">
                          Clear All Filters
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort Dropdown - Compact */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 border-white/10 bg-zinc-950/50 h-10">
                        <ArrowUpDown className="h-4 w-4" />
                        Sort
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-zinc-900/95 backdrop-blur-xl border-white/10">
                      <DropdownMenuItem
                        onClick={() => { setSortBy("createdAt"); setSortOrder("desc"); }}
                        className="text-sm hover:bg-red-500/10 cursor-pointer"
                      >
                        Latest Added
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => { setSortBy("releaseYear"); setSortOrder("desc"); }}
                        className="text-sm hover:bg-red-500/10 cursor-pointer"
                      >
                        Newest First
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => { setSortBy("releaseYear"); setSortOrder("asc"); }}
                        className="text-sm hover:bg-red-500/10 cursor-pointer"
                      >
                        Oldest First
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => { setSortBy("title"); setSortOrder("asc"); }}
                        className="text-sm hover:bg-red-500/10 cursor-pointer"
                      >
                        Title A-Z
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => { setSortBy("views"); setSortOrder("desc"); }}
                        className="text-sm hover:bg-red-500/10 cursor-pointer"
                      >
                        Most Viewed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* View Mode Toggle - Compact */}
                  <div className="flex gap-0.5 border border-white/10 rounded-lg p-0.5 bg-zinc-950/50">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "h-8 w-8 transition-all",
                        viewMode === "grid"
                          ? "bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-500/30"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "h-8 w-8 transition-all",
                        viewMode === "list"
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-500/30"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <List className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters Display - Compact */}
              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/10"
                  >
                    {searchTerm && (
                      <Badge variant="secondary" className="gap-1 text-xs py-0.5 px-2 bg-zinc-800">
                        &ldquo;{searchTerm}&rdquo;
                        <X className="h-2.5 w-2.5 cursor-pointer hover:text-red-400" onClick={() => setSearchTerm("")} />
                      </Badge>
                    )}
                    {selectedGenres.map((genre) => (
                      <Badge key={genre} variant="secondary" className="gap-1 text-xs py-0.5 px-2 bg-red-500/20 text-red-300">
                        {genre}
                        <X className="h-2.5 w-2.5 cursor-pointer" onClick={() => toggleGenre(genre)} />
                      </Badge>
                    ))}
                    {selectedMediaType && (
                      <Badge variant="secondary" className="gap-1 text-xs py-0.5 px-2 bg-blue-500/20 text-blue-300">
                        {selectedMediaType.replace("_", " ")}
                        <X className="h-2.5 w-2.5 cursor-pointer" onClick={() => setSelectedMediaType("")} />
                      </Badge>
                    )}
                    {selectedYear && (
                      <Badge variant="secondary" className="gap-1 text-xs py-0.5 px-2 bg-emerald-500/20 text-emerald-300">
                        {selectedYear}
                        <X className="h-2.5 w-2.5 cursor-pointer" onClick={() => setSelectedYear(null)} />
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="h-6 text-xs text-muted-foreground hover:text-red-400 px-2"
                    >
                      Clear all
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Stats - Compact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between items-center mb-4"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  Loading...
                </span>
              ) : (
                <span className="text-foreground">
                  <span className="text-red-400">{totalCount.toLocaleString()}</span> results found
                </span>
              )}
            </h2>
            {hasActiveFilters && (
              <Badge variant="outline" className="text-xs border-white/10">
                Filtered
              </Badge>
            )}
          </div>

          {isFetching && !isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-blue-400">
              <div className="w-3 h-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              Updating...
            </div>
          )}
        </motion.div>

        {/* Content Display */}
        {isLoading ? (
          <div className={cn(
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
              : "space-y-3"
          )}>
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl">
                <div className="aspect-[2/3] bg-gradient-to-br from-zinc-900 to-zinc-800">
                  <ShimmerSkeleton className="h-full w-full" />
                </div>
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded">
                    <ShimmerSkeleton className="h-full w-3/4" />
                  </div>
                  <div className="h-3 bg-zinc-800 rounded">
                    <ShimmerSkeleton className="h-full w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Card className="border-red-500/50 bg-gradient-to-br from-red-950/20 to-zinc-950">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-red-300 font-medium mb-4">Failed to load content. Please try again.</p>
              <Button onClick={() => refetch()} variant="outline" className="border-red-500/50 text-red-300">
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ContentGrid
            contents={contents}
            viewMode={viewMode}
            emptyMessage={
              <div className="flex flex-col items-center justify-center py-12">
                <Film className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No content found</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
                  No movies or TV shows match your current filters.
                </p>
                <Button onClick={clearAllFilters} variant="outline" size="sm">
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