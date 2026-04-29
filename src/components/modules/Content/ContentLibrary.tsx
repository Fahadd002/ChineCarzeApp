"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllContents } from "@/services/content.services";
import { ContentGrid } from "./ContentGrid";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShimmerSkeleton } from "@/components/ui/motion";
import { motion } from "framer-motion";
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
  Sparkles,
  Play,
  Download,
  Heart,
  Clock,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-[#0a0a0f] to-black relative overflow-hidden">
      {/* Cinematic Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[40vh] min-h-[320px] overflow-hidden"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-purple-950/20 to-zinc-950/60" />

        {/* Animated floating orbs */}
        <FloatingOrb color="red" size="md" className="top-10 left-10" />
        <FloatingOrb color="purple" size="lg" className="bottom-10 right-10" />
        <FloatingOrb color="mixed" size="sm" className="top-1/2 left-1/3" />

        {/* Grain texture overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 250 250%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.03%22/%3E%3C/svg%3E')] opacity-30 pointer-events-none" />

        {/* Hero content */}
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-4xl space-y-6"
          >
            {/* Premium badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-purple-500/10 border border-red-500/20 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium text-foreground">Explore CineCraze Library</span>
            </motion.div>

            {/* Main heading with gradient text */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9]">
              <span className="block bg-gradient-to-r from-red-400 via-red-300 to-white bg-clip-text text-transparent">
                Discover
              </span>
              <span className="block bg-gradient-to-r from-white via-purple-200 to-red-200 bg-clip-text text-transparent">
                Cinematic
              </span>
              <span className="block text-white">Universe</span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed"
            >
              Millions of movies, TV shows, and exclusive content await. Your next binge starts here.
            </motion.p>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Film className="h-5 w-5 text-red-400" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {isLoading ? "..." : totalCount.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">Titles</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-2xl font-bold text-white">4K+</span>
                <span className="text-sm text-muted-foreground">Quality</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-2xl font-bold text-white">24/7</span>
                <span className="text-sm text-muted-foreground">Streaming</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </motion.section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative">
        {/* Search & Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <Card className="overflow-hidden border-0 bg-gradient-to-r from-zinc-900/90 via-zinc-900/50 to-zinc-900/90 backdrop-blur-xl shadow-2xl relative">
            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none" />

            <CardContent className="p-6 relative">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search input */}
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-red-500 transition-colors" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by title, director, cast..."
                    className="pl-12 h-14 text-base bg-zinc-950/50 border-white/10 focus:border-red-500/50 focus:ring-red-500/20 text-foreground placeholder:text-muted-foreground rounded-xl transition-all"
                  />
                  {searchTerm && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {/* Mobile filter sheet */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <AnimatedButton
                        variant="outline"
                        size="lg"
                        glowColor="blue"
                        className="gap-2 border-white/10 bg-zinc-950/50 hover:bg-zinc-900 min-w-[140px]"
                      >
                        <Filter className="h-4 w-4" />
                        Filters
                        {hasActiveFilters && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium"
                          >
                            {selectedGenres.length + (selectedMediaType ? 1 : 0) + (selectedYear ? 1 : 0) + (searchTerm ? 1 : 0)}
                          </motion.span>
                        )}
                      </AnimatedButton>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto bg-zinc-950/95 backdrop-blur-xl border-white/10">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2 text-2xl">
                          <Filter className="h-5 w-5 text-red-500" />
                          <span className="bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                            Filter Content
                          </span>
                        </SheetTitle>
                        <SheetDescription className="text-muted-foreground">
                          Refine your search with advanced filters
                        </SheetDescription>
                      </SheetHeader>
                      <Separator className="my-6 bg-white/10" />

                      <div className="space-y-8">
                        {/* Genre Filter */}
                        <div>
                          <Label className="text-base font-semibold mb-4 block text-foreground flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-400" />
                            Genres
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {availableGenres.map((genre) => {
                              const isSelected = selectedGenres.includes(genre);
                              return (
                                <motion.div
                                  key={genre}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Badge
                                    variant={isSelected ? "default" : "outline"}
                                    className={cn(
                                      "cursor-pointer transition-all duration-300 px-3 py-1.5 text-sm font-medium",
                                      isSelected
                                        ? "bg-gradient-to-r from-red-500 to-red-600 border-0 text-white shadow-lg shadow-red-500/30"
                                        : "bg-zinc-900 text-gray-300 border-white/10 hover:border-white/30 hover:bg-zinc-800"
                                    )}
                                    onClick={() => toggleGenre(genre)}
                                  >
                                    {genre}
                                  </Badge>
                                </motion.div>
                              );
                            })}
                          </div>
                          {selectedGenres.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3"
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedGenres([])}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 -ml-2"
                              >
                                Clear all genres
                              </Button>
                            </motion.div>
                          )}
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Media Type */}
                        <div>
                          <Label className="text-base font-semibold mb-4 block text-foreground flex items-center gap-2">
                            <Film className="h-4 w-4 text-blue-400" />
                            Content Type
                          </Label>
                          <div className="grid grid-cols-2 gap-3">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                variant={selectedMediaType === "MOVIE" ? "default" : "outline"}
                                className={`justify-start gap-3 h-14 text-base transition-all ${
                                  selectedMediaType === "MOVIE"
                                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 shadow-lg shadow-red-500/30"
                                    : "bg-zinc-900 border-white/10 text-gray-300 hover:bg-zinc-800 hover:border-white/20"
                                }`}
                                onClick={() => setSelectedMediaType(selectedMediaType === "MOVIE" ? "" : "MOVIE")}
                              >
                                <Film className="h-5 w-5" />
                                Movies
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                variant={selectedMediaType === "TV_SERIES" ? "default" : "outline"}
                                className={`justify-start gap-3 h-14 text-base transition-all ${
                                  selectedMediaType === "TV_SERIES"
                                    ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border-0 shadow-lg shadow-purple-500/30"
                                    : "bg-zinc-900 border-white/10 text-gray-300 hover:bg-zinc-800 hover:border-white/20"
                                }`}
                                onClick={() => setSelectedMediaType(selectedMediaType === "TV_SERIES" ? "" : "TV_SERIES")}
                              >
                                <Tv className="h-5 w-5" />
                                TV Series
                              </Button>
                            </motion.div>
                          </div>
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Release Year */}
                        <div>
                          <Label className="text-base font-semibold mb-4 block text-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4 text-green-400" />
                            Release Year
                          </Label>
                          <select
                            value={selectedYear || ""}
                            onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 transition-all"
                          >
                            <option value="">All Years</option>
                            {releaseYears.map((year) => (
                              <option key={year} value={year} className="bg-zinc-900">
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>

                        <Separator className="bg-white/10" />

                        {/* Price Range */}
                        <div>
                          <Label className="text-base font-semibold mb-4 block text-foreground flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-amber-400" />
                            Price Range ($)
                          </Label>
                          <Slider
                            min={0}
                            max={100}
                            step={5}
                            value={priceRange}
                            onValueChange={(value) => setPriceRange(value as [number, number])}
                            className="mt-2"
                          />
                          <div className="flex justify-between mt-3 text-sm text-muted-foreground font-mono">
                            <span className="px-2 py-1 bg-white/5 rounded border border-white/10">${priceRange[0]}</span>
                            <span className="px-2 py-1 bg-white/5 rounded border border-white/10">${priceRange[1]}+</span>
                          </div>
                        </div>
                      </div>

                      <div className="sticky bottom-0 bg-zinc-950/95 backdrop-blur-xl pt-6 mt-6 border-t border-white/10">
                        <Button onClick={clearAllFilters} variant="outline" className="w-full border-white/10 hover:bg-white/5 transition-all">
                          Clear All Filters
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <AnimatedButton
                        variant="outline"
                        size="lg"
                        glowColor="purple"
                        className="gap-2 border-white/10 bg-zinc-950/50 min-w-[120px]"
                      >
                        <TrendingUp className="h-4 w-4" />
                        Sort
                        <ChevronDown className="h-4 w-4" />
                      </AnimatedButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-zinc-900/95 backdrop-blur-xl border-white/10">
                      <DropdownMenuItem
                        onClick={() => { setSortBy("createdAt"); setSortOrder("desc"); }}
                        className="hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer text-foreground"
                      >
                        <span className="flex items-center gap-2">
                          <motion.div
                            initial={{ scale: sortBy === "createdAt" ? 1.5 : 1 }}
                            animate={{ scale: 1.2 }}
                            className="w-2 h-2 rounded-full bg-red-500"
                          />
                          Latest Added
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => { setSortBy("releaseYear"); setSortOrder("desc"); }}
                        className="hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer text-foreground"
                      >
                        <span className="flex items-center gap-2">
                          {sortBy === "releaseYear" && sortOrder === "desc" && (
                            <motion.div
                              initial={{ rotate: 0 }}
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.3 }}
                              className="w-2 h-2 rounded-full bg-purple-500"
                            />
                          )}
                          Newest First
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => { setSortBy("releaseYear"); setSortOrder("asc"); }}
                        className="hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer text-foreground"
                      >
                        Oldest First
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => { setSortBy("title"); setSortOrder("asc"); }}
                        className="hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer text-foreground"
                      >
                        Title A-Z
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => { setSortBy("views"); setSortOrder("desc"); }}
                        className="hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer text-foreground"
                      >
                        Most Viewed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* View Mode Toggle */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-1 border border-white/10 rounded-xl p-1 bg-zinc-950/50 backdrop-blur-sm"
                  >
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "h-10 w-10 transition-all",
                        viewMode === "grid"
                          ? "bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-500/30 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "h-10 w-10 transition-all",
                        viewMode === "list"
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-500/30 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10"
                >
                  {searchTerm && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 bg-zinc-900/80 text-foreground border-white/10 hover:border-red-500/30 backdrop-blur-sm"
                    >
                      <Search className="h-3 w-3" />
                      \u201C{searchTerm}\u201D
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSearchTerm("")}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </motion.button>
                    </Badge>
                  )}
                  {selectedGenres.map((genre) => (
                    <motion.div
                      key={genre}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Badge
                        variant="secondary"
                        className="gap-1.5 bg-red-500/15 text-red-300 border-red-500/30 hover:bg-red-500/25 backdrop-blur-sm"
                      >
                        {genre}
                        <button
                          onClick={() => toggleGenre(genre)}
                          className="hover:text-red-200 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  ))}
                  {selectedMediaType && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 bg-blue-500/15 text-blue-300 border-blue-500/30 backdrop-blur-sm"
                    >
                      <Film className="h-3 w-3" />
                      {selectedMediaType.replace("_", " ")}
                      <button
                        onClick={() => setSelectedMediaType("")}
                        className="hover:text-blue-200 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedYear && (
                    <Badge
                      variant="secondary"
                      className="gap-1.5 bg-emerald-500/15 text-emerald-300 border-emerald-500/30 backdrop-blur-sm"
                    >
                      <Clock className="h-3 w-3" />
                      {selectedYear}
                      <button
                        onClick={() => setSelectedYear(null)}
                        className="hover:text-emerald-200 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  <AnimatedButton
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-7 text-xs text-muted-foreground hover:text-red-400 px-2"
                  >
                    Clear all
                  </AnimatedButton>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full"
                  />
                  <span className="text-foreground/50">Loading...</span>
                </div>
              ) : (
                <>
                  <span className="bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                    {totalCount.toLocaleString()}
                  </span>
                  <span className="text-foreground/60 text-lg">Results</span>
                </>
              )}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {hasActiveFilters ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Filtered results matching your criteria
                </span>
              ) : (
                "All available content"
              )}
            </p>
          </div>

          {isFetching && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full"
              />
              <span className="text-sm text-blue-400 font-medium">Updating...</span>
            </motion.div>
          )}
        </motion.div>

        {/* Content Display */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                : "space-y-4"
            )}
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative overflow-hidden rounded-2xl"
              >
                <div className="aspect-[2/3] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
                  <ShimmerSkeleton className="h-full w-full" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-zinc-800 rounded-lg overflow-hidden">
                    <ShimmerSkeleton className="h-full w-3/4" />
                  </div>
                  <div className="h-4 bg-zinc-800 rounded-lg overflow-hidden">
                    <ShimmerSkeleton className="h-full w-1/2" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-zinc-800 rounded-md overflow-hidden">
                      <ShimmerSkeleton className="h-full w-full" />
                    </div>
                    <div className="h-6 w-20 bg-zinc-800 rounded-md overflow-hidden">
                      <ShimmerSkeleton className="h-full w-full" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card className="border-red-500/50 bg-gradient-to-br from-red-950/30 to-zinc-950 backdrop-blur-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.1),transparent_70%)]" />
              <CardContent className="flex flex-col items-center justify-center py-12 relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
                  className="h-16 w-16 rounded-2xl bg-red-500/20 flex items-center justify-center mb-4"
                >
                  <Download className="h-8 w-8 text-red-400" />
                </motion.div>
                <p className="text-red-300 font-medium text-lg mb-4">
                  Failed to load content. Please try again.
                </p>
                <AnimatedButton
                  onClick={() => refetch()}
                  variant="outline"
                  glowColor="red"
                  className="border-red-500/50 text-red-300 hover:bg-red-500/10"
                >
                  Retry
                </AnimatedButton>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <ContentGrid
            contents={contents}
            viewMode={viewMode}
            emptyMessage={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-16 px-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="h-20 w-20 rounded-full bg-zinc-900/50 flex items-center justify-center mb-6"
                >
                  <Film className="h-10 w-10 text-muted-foreground/50" />
                </motion.div>
                <h3 className="text-xl font-medium text-foreground mb-2">
                  No content found
                </h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">
                  No movies or TV shows match your current filters. Try adjusting your search criteria.
                </p>
                <AnimatedButton
                  onClick={clearAllFilters}
                  variant="outline"
                  glowColor="blue"
                  className="border-white/10 hover:bg-white/5"
                >
                  Clear Filters
                </AnimatedButton>
              </motion.div>
            }
          />
        )}
      </div>
    </div>
  );
}
