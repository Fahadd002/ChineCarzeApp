"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Filter, X, Sparkles, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface DataTableFilterOption {
  label: string;
  value: string;
}

export type RangeOperator = "gte" | "lte";

interface BaseFilterConfig {
  id: string;
  label: string;
}

export interface SingleSelectFilterConfig extends BaseFilterConfig {
  type: "single-select";
  options: DataTableFilterOption[];
}

export interface MultiSelectFilterConfig extends BaseFilterConfig {
  type: "multi-select";
  options: DataTableFilterOption[];
}

export interface RangeFilterConfig extends BaseFilterConfig {
  type: "range";
}

export type DataTableFilterConfig =
  | SingleSelectFilterConfig
  | MultiSelectFilterConfig
  | RangeFilterConfig;

export type DataTableRangeValue = Partial<Record<RangeOperator, string>>;

export type DataTableFilterValue = string | string[] | DataTableRangeValue;

export type DataTableFilterValues = Record<string, DataTableFilterValue | undefined>;

interface DataTableFiltersProps {
  filters: DataTableFilterConfig[];
  values: DataTableFilterValues;
  onFilterChange: (filterId: string, value: DataTableFilterValue | undefined) => void;
  onClearAll?: () => void;
  isLoading?: boolean;
}

const RANGE_OPERATOR_LABEL: Record<RangeOperator, string> = {
  gte: "Min",
  lte: "Max",
};

const isRangeValue = (value: DataTableFilterValue | undefined): value is DataTableRangeValue => {
  return !!value && !Array.isArray(value) && typeof value === "object";
};

const getFilterActiveCount = (
  filter: DataTableFilterConfig,
  value: DataTableFilterValue | undefined,
): number => {
  if (!value) {
    return 0;
  }

  if (filter.type === "single-select") {
    return typeof value === "string" && value.length > 0 ? 1 : 0;
  }

  if (filter.type === "multi-select") {
    return Array.isArray(value) ? value.length : 0;
  }

  if (isRangeValue(value)) {
    return Object.values(value).filter((item) => item && item.length > 0).length;
  }

  return 0;
};

const MultiSelectFilterControl = ({
  filter,
  value,
  isLoading,
  onFilterChange,
}: {
  filter: MultiSelectFilterConfig;
  value: string[];
  isLoading?: boolean;
  onFilterChange: (filterId: string, value: DataTableFilterValue | undefined) => void;
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(value);

  const applyNow = () => {
    onFilterChange(
      filter.id,
      selectedValues.length > 0 ? selectedValues : undefined,
    );
  };

  return (
    <div className="space-y-4">
      <div className="max-h-52 space-y-2 overflow-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {filter.options.map((option) => {
          const checked = selectedValues.includes(option.value);

          return (
            <motion.label
              key={option.value}
              whileHover={{ scale: 1.02 }}
              className="flex cursor-pointer items-center gap-3 text-sm p-2 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(checkedState) => {
                  const nextValues = checkedState
                    ? [...selectedValues, option.value]
                    : selectedValues.filter((item) => item !== option.value);

                  setSelectedValues(nextValues);
                }}
                disabled={isLoading}
                className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
              />
              <span className="flex-1 text-foreground group-hover:text-primary transition-colors">
                {option.label}
              </span>
              {checked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="h-4 w-4 text-emerald-400" />
                </motion.div>
              )}
            </motion.label>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setSelectedValues([])}
            disabled={isLoading}
            className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
          >
            Clear
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="button"
            size="sm"
            onClick={applyNow}
            disabled={isLoading}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 shadow-lg shadow-red-500/20"
          >
            Apply
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

const SingleSelectFilterControl = ({
  filter,
  value,
  isLoading,
  onFilterChange,
}: {
  filter: SingleSelectFilterConfig;
  value: string;
  isLoading?: boolean;
  onFilterChange: (filterId: string, value: DataTableFilterValue | undefined) => void;
}) => {
  return (
    <div className="space-y-3">
      <Select
        value={value || "all"}
        onValueChange={(nextValue) => {
          onFilterChange(filter.id, nextValue === "all" ? undefined : nextValue);
        }}
      >
        <SelectTrigger
          disabled={isLoading}
          className="bg-zinc-950/50 border-white/10 focus:border-red-500/50 focus:ring-red-500/20"
        >
          <SelectValue placeholder={filter.label} />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900/95 backdrop-blur-xl border-white/10">
          <SelectItem value="all" className="hover:bg-zinc-800 focus:bg-zinc-800">
            All
          </SelectItem>
          {filter.options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="hover:bg-zinc-800 focus:bg-zinc-800"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const RANGE_OPERATORS: RangeOperator[] = ["gte", "lte"];

const RangeFilterControl = ({
  filter,
  value,
  isLoading,
  onFilterChange,
}: {
  filter: RangeFilterConfig;
  value: DataTableRangeValue;
  isLoading?: boolean;
  onFilterChange: (filterId: string, value: DataTableFilterValue | undefined) => void;
}) => {
  const [rangeValue, setRangeValue] = useState<DataTableRangeValue>(value);

  const applyNow = () => {
    const hasAnyValue = RANGE_OPERATORS.some((operator) => rangeValue[operator]?.trim());
    onFilterChange(filter.id, hasAnyValue ? rangeValue : undefined);
  };

  const clearRange = () => {
    setRangeValue({});
    onFilterChange(filter.id, undefined);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {RANGE_OPERATORS.map((operator) => (
          <div key={operator} className="space-y-2">
            <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {RANGE_OPERATOR_LABEL[operator]}
            </Label>
            <div className="relative">
              <Input
                type="number"
                value={rangeValue[operator] ?? ""}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setRangeValue((prevValue) => ({
                    ...prevValue,
                    [operator]: nextValue,
                  }));
                }}
                placeholder="0"
                disabled={isLoading}
                className="bg-zinc-950/50 border-white/10 focus:border-blue-500/50 focus:ring-blue-500/20"
              />
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: value.gte || value.lte ? 1 : 0 }}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 origin-left"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={clearRange}
            disabled={isLoading}
            className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
          >
            Clear
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="button"
            size="sm"
            onClick={applyNow}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 shadow-lg shadow-blue-500/20"
          >
            Apply
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

type ActiveBadge = {
  key: string;
  label: string;
  onRemove: () => void;
};

const DataTableFilters = ({
  filters,
  values,
  onFilterChange,
  onClearAll,
  isLoading,
}: DataTableFiltersProps) => {
  const totalActiveFilters = useMemo(() => {
    return filters.reduce((totalCount, filter) => {
      return totalCount + getFilterActiveCount(filter, values[filter.id]);
    }, 0);
  }, [filters, values]);

  const activeBadges = useMemo<ActiveBadge[]>(() => {
    const badges: ActiveBadge[] = [];
    for (const filter of filters) {
      const filterValue = values[filter.id];

      if (filter.type === "single-select") {
        if (typeof filterValue === "string" && filterValue.length > 0) {
          const option = filter.options.find((o) => o.value === filterValue);
          badges.push({
            key: `${filter.id}:${filterValue}`,
            label: `${filter.label}: ${option?.label ?? filterValue}`,
            onRemove: () => onFilterChange(filter.id, undefined),
          });
        }
      }

      if (filter.type === "multi-select" && Array.isArray(filterValue)) {
        for (const val of filterValue) {
          const option = filter.options.find((o) => o.value === val);
          badges.push({
            key: `${filter.id}:${val}`,
            label: `${filter.label}: ${option?.label ?? val}`,
            onRemove: () => {
              const next = (filterValue as string[]).filter((v) => v !== val);
              onFilterChange(filter.id, next.length > 0 ? next : undefined);
            },
          });
        }
      }

      if (filter.type === "range" && isRangeValue(filterValue)) {
        for (const op of RANGE_OPERATORS) {
          const val = filterValue[op]?.trim();
          if (val) {
            badges.push({
              key: `${filter.id}:${op}`,
              label: `${filter.label}: ${RANGE_OPERATOR_LABEL[op]} ${val}`,
              onRemove: () => {
                const next: DataTableRangeValue = { ...filterValue, [op]: "" };
                const hasAny = RANGE_OPERATORS.some((o) => next[o]?.trim());
                onFilterChange(filter.id, hasAny ? next : undefined);
              },
            });
          }
        }
      }
    }
    return badges;
  }, [filters, values, onFilterChange]);

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => {
          const filterValue = values[filter.id];
          const activeCount = getFilterActiveCount(filter, filterValue);
          const triggerClass = cn(
            "h-9 transition-all duration-300 border-white/10 bg-zinc-950/50 hover:bg-zinc-900 hover:border-white/20 backdrop-blur-sm",
            activeCount > 0 && "border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-500"
          );

          return (
            <Popover key={`${filter.id}-${JSON.stringify(filterValue ?? null)}`}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={triggerClass}
                  disabled={isLoading}
                >
                  <span className="flex items-center gap-2">
                    {filter.label}
                    {activeCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <Badge className="h-5 min-w-5 px-1.5 bg-red-500 text-white border-0">
                          {activeCount}
                        </Badge>
                      </motion.div>
                    )}
                  </span>
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                className="w-80 p-0 border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-xl overflow-hidden"
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/5 bg-gradient-to-r from-zinc-900/50 to-zinc-800/30">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-red-400" />
                    {filter.label}
                  </h3>
                </div>

                <div className="p-4">
                  {filter.type === "single-select" && (
                    <SingleSelectFilterControl
                      filter={filter}
                      value={typeof filterValue === "string" ? filterValue : ""}
                      isLoading={isLoading}
                      onFilterChange={onFilterChange}
                    />
                  )}

                  {filter.type === "multi-select" && (
                    <MultiSelectFilterControl
                      filter={filter}
                      value={Array.isArray(filterValue) ? filterValue : []}
                      isLoading={isLoading}
                      onFilterChange={onFilterChange}
                    />
                  )}

                  {filter.type === "range" && (
                    <RangeFilterControl
                      filter={filter}
                      value={isRangeValue(filterValue) ? filterValue : {}}
                      isLoading={isLoading}
                      onFilterChange={onFilterChange}
                    />
                  )}
                </div>
              </PopoverContent>
            </Popover>
          );
        })}

        {onClearAll && totalActiveFilters > 0 && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="button"
              variant="ghost"
              className="h-9 gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={onClearAll}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          </motion.div>
        )}

          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Filter className="h-3.5 w-3.5 text-red-400" />
            <motion.span
              key={totalActiveFilters}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="font-mono min-w-[1ch]"
            >
              {totalActiveFilters}
            </motion.span>
          </div>
        </div>

        {/* Active filter badges */}
        <AnimatePresence mode="popLayout">
          {activeBadges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-1.5"
            >
              {activeBadges.map((badge) => (
                <motion.div
                  key={badge.key}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  layout
                >
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 pr-1 text-xs bg-gradient-to-r from-red-500/10 to-purple-500/10 border border-red-500/20 hover:border-red-500/40 transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-400" />
                      {badge.label}
                    </span>
                    <button
                      type="button"
                      onClick={badge.onRemove}
                      disabled={isLoading}
                      className="ml-0.5 rounded-full p-0.5 hover:bg-red-500/20 transition-colors disabled:pointer-events-none"
                      aria-label={`Remove ${badge.label}`}
                    >
                      <X className="h-3 w-3 text-red-400" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DataTableFilters;
