"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Table as TanstackTable } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, FastForward, Rewind, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PaginationToken = number | "start-ellipsis" | "end-ellipsis";

const DEFAULT_PAGE_SIZES = [1, 10, 20, 50, 100] as const;

const isDefaultPageSize = (value: number) => {
  return DEFAULT_PAGE_SIZES.includes(value as (typeof DEFAULT_PAGE_SIZES)[number]);
};

const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): PaginationToken[] => {
  if (totalPages <= 0) {
    return [];
  }

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 5) {
    return [1, 2, 3, 4, 5, "end-ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 4) {
    return [
      1,
      "start-ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "start-ellipsis",
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
    "end-ellipsis",
    totalPages,
  ];
};

interface DataTablePaginationProps<TData> {
  table: TanstackTable<TData>;
  totalRows?: number;
  totalPages?: number;
  isLoading?: boolean;
}

const DataTablePagination = <TData,>({
  table,
  totalRows,
  totalPages,
  isLoading,
}: DataTablePaginationProps<TData>) => {
  const pagination = table.getState().pagination;
  const pageSize = pagination.pageSize;
  const currentPage = pagination.pageIndex + 1;
  const computedTotalPages = totalPages ?? table.getPageCount();

  const [isCustomMode, setIsCustomMode] = useState<boolean>(!isDefaultPageSize(pageSize));
  const [customPageSize, setCustomPageSize] = useState<string>(String(pageSize));

  const isCurrentPageSizeCustom = !isDefaultPageSize(pageSize);
  const showCustomInput = isCustomMode || isCurrentPageSizeCustom;
  const pageSizeSelectValue = showCustomInput ? "custom" : String(pageSize);

  const paginationItems = useMemo(
    () => getPaginationItems(currentPage, computedTotalPages),
    [currentPage, computedTotalPages],
  );

  const applyCustomPageSize = () => {
    const parsed = Number(customPageSize);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return;
    }

    setIsCustomMode(!isDefaultPageSize(parsed));

    table.setPagination({
      pageIndex: 0,
      pageSize: parsed,
    });
  };

  const onPageSizeSelect = (value: string) => {
    if (value === "custom") {
      setIsCustomMode(true);
      setCustomPageSize(String(pageSize));
      return;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return;
    }

    setIsCustomMode(false);
    setCustomPageSize(String(parsed));

    table.setPagination({
      pageIndex: 0,
      pageSize: parsed,
    });
  };

  const jumpBackwardTarget = Math.max(1, currentPage - 5);
  const jumpForwardTarget = Math.min(computedTotalPages, currentPage + 5);

  if (computedTotalPages <= 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 border-t border-white/5 px-4 py-4 md:flex-row md:items-center md:justify-between bg-gradient-to-r from-zinc-900/50 to-zinc-900/30 backdrop-blur-sm"
    >
      {/* Navigation Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* First page button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage() || isLoading}
            className="h-9 min-w-9 px-2 text-muted-foreground hover:text-white hover:bg-white/5"
          >
            <Rewind className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Previous page */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
            className="h-9 gap-1.5 border-white/10 bg-zinc-950/50 hover:bg-zinc-900 hover:border-white/20"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Prev</span>
          </Button>
        </motion.div>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          <AnimatePresence mode="popLayout">
            {paginationItems.map((item) => {
              if (item === "start-ellipsis" || item === "end-ellipsis") {
                return (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 min-w-9 px-2 text-muted-foreground/60 hover:text-white hover:bg-white/5 select-none cursor-default"
                      onClick={() => table.setPageIndex(item === "start-ellipsis" ? jumpBackwardTarget - 1 : jumpForwardTarget - 1)}
                      disabled={isLoading}
                    >
                      ...
                    </Button>
                  </motion.div>
                );
              }

              const isActive = item === currentPage;
              return (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <Button
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-9 min-w-9 transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30 border-0"
                        : "border-white/10 bg-zinc-950/50 text-foreground hover:bg-zinc-900 hover:border-white/20"
                    )}
                    onClick={() => table.setPageIndex(item - 1)}
                    disabled={isLoading}
                  >
                    {isActive && <Sparkles className="mr-1 h-3 w-3" />}
                    {item}
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Next page */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
            className="h-9 gap-1.5 border-white/10 bg-zinc-950/50 hover:bg-zinc-900 hover:border-white/20"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Last page button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.setPageIndex(computedTotalPages - 1)}
            disabled={!table.getCanNextPage() || isLoading}
            className="h-9 min-w-9 px-2 text-muted-foreground hover:text-white hover:bg-white/5"
          >
            <FastForward className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {/* Page size & info */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Rows per page</span>
          <Select value={pageSizeSelectValue} onValueChange={onPageSizeSelect}>
            <SelectTrigger className="w-20 h-9 bg-zinc-950/50 border-white/10 hover:border-white/20">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900/95 backdrop-blur-xl border-white/10">
              {DEFAULT_PAGE_SIZES.map((size) => (
                <SelectItem
                  key={size}
                  value={String(size)}
                  className="hover:bg-zinc-800 focus:bg-zinc-800"
                >
                  {size}
                </SelectItem>
              ))}
              <SelectItem value="custom" className="hover:bg-zinc-800 focus:bg-zinc-800">
                Custom
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom page size input */}
        <AnimatePresence>
          {showCustomInput && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <Input
                type="number"
                min={1}
                className="h-9 w-20 bg-zinc-950/50 border-white/10"
                value={customPageSize}
                onChange={(event) => setCustomPageSize(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applyCustomPageSize();
                  }
                }}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={applyCustomPageSize}
                disabled={isLoading}
                className="h-9 border-white/10 hover:bg-zinc-900"
              >
                Apply
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <motion.span
            key={`${totalRows}-${computedTotalPages}`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs px-2 py-1 rounded bg-white/5 border border-white/10"
          >
            {totalRows?.toLocaleString() || 0} items
          </motion.span>
          <span>/</span>
          <motion.span
            key={computedTotalPages}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs px-2 py-1 rounded bg-white/5 border border-white/10"
          >
            {computedTotalPages} pages
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export default DataTablePagination;
