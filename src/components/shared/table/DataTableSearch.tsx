"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface DataTableSearchProps {
  initialValue?: string;
  placeholder?: string;
  debounceMs?: number;
  isLoading?: boolean;
  onDebouncedChange: (value: string) => void;
}

const DataTableSearch = ({
  initialValue = "",
  placeholder = "Search...",
  debounceMs = 700,
  isLoading,
  onDebouncedChange,
}: DataTableSearchProps) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const skipNextDebounceRef = useRef(false);

  useEffect(() => {
    if (skipNextDebounceRef.current) {
      skipNextDebounceRef.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onDebouncedChange(value.trim());
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onDebouncedChange]);

  const handleClear = () => {
    skipNextDebounceRef.current = true;
    setValue("");
    onDebouncedChange("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full md:max-w-sm group"
    >
      {/* Glow effect on focus */}
      <motion.div
        animate={{
          opacity: isFocused ? 1 : 0,
          scale: isFocused ? 1 : 0.95,
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/10 via-purple-500/10 to-blue-500/10 blur-md -z-10"
      />
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 z-10 group-hover:text-red-500 transition-colors" />
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="h-10 pr-10 pl-10 bg-zinc-950/50 border-white/10 focus:border-red-500/50 focus:ring-red-500/20 rounded-lg transition-all"
        disabled={isLoading}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {value.length > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="absolute top-1/2 right-1 -translate-y-1/2 h-7 w-7 p-0 bg-zinc-900/80 hover:bg-red-500/20 text-muted-foreground hover:text-red-500 rounded-md transition-all"
            onClick={handleClear}
            aria-label="Clear search"
            disabled={isLoading}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      )}

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-1/2 right-3 -translate-y-1/2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full"
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default DataTableSearch;
