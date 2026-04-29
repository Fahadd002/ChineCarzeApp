"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import DataTableFilters, {
  DataTableFilterConfig,
  DataTableFilterValue,
  DataTableFilterValues,
} from "./DataTableFilters";
import DataTablePagination from "./DataTablePagination";
import DataTableSearch from "./DataTableSearch";
import { PaginationMeta } from "@/types/api.type";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ShimmerSkeleton } from "@/components/ui/motion";

interface DataTableActions<TData> {
    onView ?: (data : TData) => void;
    onEdit ?: (data : TData) => void;
    onDelete ?: (data : TData) => void;
}

interface DataTableProps<TData> {
    data : TData[];
    columns : ColumnDef<TData>[];
    actions ?: DataTableActions<TData>;
  toolbarAction?: React.ReactNode;
    emptyMessage ?: string;
    isLoading ?: boolean;
    sorting ?: {
      state : SortingState;
      onSortingChange : (state : SortingState) => void;
    };
    pagination?: {
      state: PaginationState;
      onPaginationChange: (state: PaginationState) => void;
    };
    search?: {
      initialValue?: string;
      placeholder?: string;
      debounceMs?: number;
      onDebouncedChange: (value: string) => void;
    };
    filters?: {
      configs: DataTableFilterConfig[];
      values: DataTableFilterValues;
      onFilterChange: (filterId: string, value: DataTableFilterValue | undefined) => void;
      onClearAll?: () => void;
    };
    meta?: PaginationMeta;
}


const DataTable = <TData,>({ data = [] as TData[], columns, actions, toolbarAction, emptyMessage, isLoading, sorting, pagination, search, filters, meta } : DataTableProps<TData>) => {

    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
      setHasHydrated(true);
    }, []);

    const showLoadingOverlay = Boolean(isLoading) && hasHydrated;


    const tableColumns : ColumnDef<TData>[] = actions ? [...columns,
        
        // Action column
        {
            id : "actions", // Unique id for the column
            header: "Actions",
            enableSorting: false,
            cell: ({ row }) => {
                const rowData = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"} className="h-8 w-8 p-0">
                                <span className="sr-only">Open Menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            {
                                actions.onView && (
                                    <DropdownMenuItem onClick={() => actions.onView?.(rowData)}>
                                        View
                                    </DropdownMenuItem>
                                )
                            }

                            {
                                actions.onEdit && (
                                    <DropdownMenuItem onClick={() => actions.onEdit?.(rowData)}>
                                        Edit
                                    </DropdownMenuItem>
                                )
                            }

                            {
                                actions.onDelete && (
                                    <DropdownMenuItem onClick={() => actions.onDelete?.(rowData)}>
                                        Delete
                                    </DropdownMenuItem>
                                )
                            }

                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ] : columns;

    // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table is intentionally used here and React Compiler already skips memoization for this hook.
    const table = useReactTable({
      data,
      columns: tableColumns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel:getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      manualSorting: !!sorting,
      manualPagination: !!pagination,
      pageCount: pagination ? Math.max(meta?.totalPages ?? 0, 0) : undefined,
      state : {
        ...(sorting ? { sorting : sorting.state } : {}),
        ...(pagination ? { pagination: pagination.state } : {}),
      },
      onSortingChange : sorting ? 
        (updater) => {
          const currentSortingState = sorting.state;

          const nextSortingState = typeof updater === "function" ? updater(currentSortingState) : updater;

          sorting.onSortingChange(nextSortingState);
        }
      : undefined,
      onPaginationChange: pagination
        ? (updater) => {
            const currentPaginationState = pagination.state;
            const nextPaginationState =
              typeof updater === "function"
                ? updater(currentPaginationState)
                : updater;

            pagination.onPaginationChange(nextPaginationState);
          }
        : undefined,
    });
     return (
       <div className="relative group">
         {/* Premium glass card container */}
         <div className="relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-b from-zinc-900/95 to-zinc-900/80 backdrop-blur-xl shadow-lg">
           {/* Ambient glow effect */}
           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
             <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-purple-500/5 to-blue-500/5" />
           </div>

           {/* Loading overlay */}
           {showLoadingOverlay && (
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-background/80 backdrop-blur-md z-20 flex items-center justify-center"
             >
               <div className="flex flex-col items-center gap-4">
                 <motion.div
                   animate={{ rotate: 360 }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                   className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary"
                 />
                 <div className="flex items-center gap-2">
                   <motion.div
                     animate={{ scale: [1, 1.2, 1] }}
                     transition={{ duration: 1.5, repeat: Infinity }}
                     className="h-2 w-2 rounded-full bg-red-500"
                   />
                   <motion.div
                     animate={{ scale: [1, 1.2, 1] }}
                     transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                     className="h-2 w-2 rounded-full bg-purple-500"
                   />
                   <motion.div
                     animate={{ scale: [1, 1.2, 1] }}
                     transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                     className="h-2 w-2 rounded-full bg-blue-500"
                   />
                 </div>
                 <span className="text-sm text-muted-foreground font-medium">Processing...</span>
               </div>
             </motion.div>
           )}

           {/* Search & Filters Toolbar */}
           {(search || filters || toolbarAction) && (
             <motion.div
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3 }}
               className="mb-4 flex flex-wrap items-start gap-3 p-4 border-b border-white/5"
             >
               {search && (
                 <DataTableSearch
                   key={search.initialValue ?? ""}
                   initialValue={search.initialValue}
                   placeholder={search.placeholder}
                   debounceMs={search.debounceMs}
                   onDebouncedChange={search.onDebouncedChange}
                   isLoading={isLoading}
                 />
               )}

               {filters && (
                 <DataTableFilters
                   filters={filters.configs}
                   values={filters.values}
                   onFilterChange={filters.onFilterChange}
                   onClearAll={filters.onClearAll}
                   isLoading={isLoading}
                 />
               )}

               {toolbarAction && (
                 <div className="ml-auto shrink-0">{toolbarAction}</div>
               )}
             </motion.div>
           )}

           {/* Table Container */}
           <div className="overflow-hidden rounded-lg">
             <Table>
               <TableHeader>
                 {table.getHeaderGroups().map((hg) => (
                   <TableRow
                     key={hg.id}
                     className="border-white/5 bg-gradient-to-r from-zinc-900/50 to-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
                   >
                     {hg.headers.map((header) => (
                       <TableHead
                         key={header.id}
                         className="text-foreground font-semibold tracking-wide"
                       >
                         {header.isPlaceholder ? null : header.column.getCanSort() ? (
                           <motion.div
                             whileHover={{ scale: 1.02 }}
                             className="inline-flex items-center gap-2"
                           >
                             <Button
                               variant={"ghost"}
                               className="h-auto cursor-pointer p-0 font-semibold hover:bg-transparent hover:text-primary focus-visible:ring-0 transition-all"
                               onClick={header.column.getToggleSortingHandler()}
                             >
                               {flexRender(
                                 header.column.columnDef.header,
                                 header.getContext(),
                               )}

                               <motion.span
                                 key={header.column.getIsSorted() || "unsorted"}
                                 initial={{ scale: 0.8, opacity: 0 }}
                                 animate={{ scale: 1, opacity: 1 }}
                                 transition={{ duration: 0.2 }}
                                 className={cn(
                                   "inline-flex items-center justify-center",
                                   header.column.getIsSorted() === "asc" ? "text-emerald-400" :
                                   header.column.getIsSorted() === "desc" ? "text-rose-400" : "text-muted-foreground/50"
                                 )}
                               >
                                 {header.column.getIsSorted() === "asc" ? (
                                   <ArrowUp className="ml-1 h-4 w-4" />
                                 ) : header.column.getIsSorted() === "desc" ? (
                                   <ArrowDown className="ml-1 h-4 w-4" />
                                 ) : (
                                   <ArrowUpDown className="ml-1 h-4 w-4" />
                                 )}
                               </motion.span>
                             </Button>
                           </motion.div>
                         ) : (
                           flexRender(
                             header.column.columnDef.header,
                             header.getContext(),
                           )
                         )}
                       </TableHead>
                     ))}
                   </TableRow>
                 ))}
               </TableHeader>
               <TableBody>
                 {table.getRowModel()?.rows?.length ? (
                   <AnimatePresence mode="popLayout">
                     {table.getRowModel().rows.map((row, index) => (
                       <motion.tr
                         key={row.id}
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0 }}
                         transition={{ duration: 0.2, delay: index * 0.02 }}
                         className="group/row border-b border-white/5 last:border-0 hover:bg-zinc-800/30 transition-all duration-200"
                       >
                         {row.getVisibleCells().map((cell) => (
                           <TableCell key={cell.id} className="relative">
                             {/* Row separator with gradient */}
                             {cell.column.id === "id" && (
                               <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-red-500 via-purple-500 to-blue-500 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300" />
                             )}
                             {flexRender(
                               cell.column.columnDef.cell,
                               cell.getContext(),
                             )}
                           </TableCell>
                         ))}
                       </motion.tr>
                     ))}
                   </AnimatePresence>
                 ) : (
                   <TableRow>
                     <TableCell
                       colSpan={tableColumns.length}
                       className="h-32 text-center"
                     >
                       <motion.div
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="flex flex-col items-center justify-center py-8"
                       >
                         <div className="h-16 w-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
                           <Sparkles className="h-8 w-8 text-muted-foreground/50" />
                         </div>
                         <p className="text-muted-foreground font-medium">
                           {emptyMessage || "No data available."}
                         </p>
                       </motion.div>
                     </TableCell>
                   </TableRow>
                 )}
               </TableBody>
             </Table>
           </div>

           {/* Pagination */}
           {pagination && (
             <DataTablePagination
               table={table}
               totalPages={meta?.totalPages}
               totalRows={meta?.total}
               isLoading={isLoading}
             />
           )}
         </div>
       </div>
     );
}

export default DataTable