"use client";

import DataTable from "@/components/shared/table/DataTable";
import {
  DataTableFilterConfig,
  DataTableFilterValues,
} from "@/components/shared/table/DataTableFilters";
import {
  serverManagedFilter,
  useServerManagedDataTableFilters,
} from "@/hooks/useServerManagedDataTableFilters";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import {  getManager } from "@/services/contentManager.services";
import { PaginationMeta } from "@/types/api.type";
import { IContentManager } from "@/types/contentManager.types";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import CreateManagerFormModal from "./CreateManagerFormModal";
import DeleteManagerConfirmationDialog from "./DeleteManagerConfirmationDialog";
import EditManagerFormModal from "./EditManagerFormModal";
import ViewManagerProfileDialog from "./ViewManagerProfileDialog";
import { managerColumns } from "./ManagerColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DOCTOR_FILTER_DEFINITIONS = [serverManagedFilter.single("gender")];


const ContentManagerTable = ({ initialQueryString }: { initialQueryString: string }) => {
    const searchParams = useSearchParams();
    const {
      viewingItem,
      editingItem,
      deletingItem,
      isViewDialogOpen,
      isEditModalOpen,
      isDeleteDialogOpen,
      onViewOpenChange,
      onEditOpenChange,
      onDeleteOpenChange,
      tableActions,
    } = useRowActionModalState<IContentManager>();

    const {
      queryStringFromUrl,
      optimisticSortingState,
      optimisticPaginationState,
      isRouteRefreshPending,
      updateParams,
      handleSortingChange,
      handlePaginationChange,
    } = useServerManagedDataTable({
      searchParams,
      defaultPage: DEFAULT_PAGE,
      defaultLimit: DEFAULT_LIMIT,
    });

    const queryString = queryStringFromUrl || initialQueryString;

    const {
      searchTermFromUrl,
      handleDebouncedSearchChange,
    } = useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

    const {
      filterValues,
      handleFilterChange,
      clearAllFilters,
    } = useServerManagedDataTableFilters({
      searchParams,
      definitions: DOCTOR_FILTER_DEFINITIONS,
      updateParams,
    });

    const { data : managerDataResponse, isLoading, isFetching } = useQuery({
      queryKey: ["managers", queryString],
      queryFn: () => getManager(queryString)
    });


    const managers = managerDataResponse?.data ?? [];

    const filterConfigs = useMemo<DataTableFilterConfig[]>(() => {
      return [
        {
          id: "gender",
          label: "Gender",
          type: "single-select",
          options: [
            { label: "Male", value: "MALE" },
            { label: "Female", value: "FEMALE" },
            { label: "Other", value: "OTHER" },
          ],
        },
        
        {
          id: "appointmentFee",
          label: "Fee Range",
          type: "range",
        },
      ];
    }, []);

    const filterValuesForTable = useMemo<DataTableFilterValues>(() => ({ gender: filterValues.gender }), [filterValues]);

    return (
      <>
        <DataTable
          data={managers}
          columns={managerColumns}
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          emptyMessage="No managers found."
          sorting={{
            state: optimisticSortingState,
            onSortingChange: handleSortingChange,
          }}
          pagination={{
            state: optimisticPaginationState,
            onPaginationChange: handlePaginationChange,
          }}
          search={{
            initialValue: searchTermFromUrl,
            placeholder: "Search manager by name, email...",
            debounceMs: 700,
            onDebouncedChange: handleDebouncedSearchChange,
          }}
          filters={{
            configs: filterConfigs,
            values: filterValuesForTable,
            onFilterChange: handleFilterChange,
            onClearAll: clearAllFilters,
          }}
          toolbarAction={
            <CreateManagerFormModal />
          }
          meta={managerDataResponse?.meta}
          actions={tableActions}
        />

        <EditManagerFormModal
          open={isEditModalOpen}
          onOpenChange={onEditOpenChange}
          manager={editingItem}
        />

        <DeleteManagerConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={onDeleteOpenChange}
          manager={deletingItem}
        />

        <ViewManagerProfileDialog
          open={isViewDialogOpen}
          onOpenChange={onViewOpenChange}
          manager={viewingItem}
        />
      </>
    )

}
export default ContentManagerTable