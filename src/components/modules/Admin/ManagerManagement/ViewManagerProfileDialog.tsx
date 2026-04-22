"use client"

import { getManagerByIdAction } from "@/app/(dashboardLayout)/admin/dashboard/content-management/_action"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type IContentManagerDetails, type IContentManager } from "@/types/contentManager.types"
import { useQuery } from "@tanstack/react-query"

interface ViewManagerProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  manager: IContentManager | null
}

const ViewManagerProfileDialog = ({ open, onOpenChange, manager }: ViewManagerProfileDialogProps) => {
  const managerId = manager ? String(manager.id) : ""

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["manager-details", managerId],
    queryFn: () => getManagerByIdAction(managerId),
    enabled: open && managerId.length > 0,
    staleTime: 1000 * 60,
  })

  const hasError = data && !data.success
  const managerDetails = data?.success && "data" in data ? data.data as IContentManagerDetails : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-5 pr-14">
          <DialogTitle>Manager Profile</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-5.5rem)]">
          <div className="space-y-4 px-6 py-5">
            {(isLoading || isFetching) && (
              <div className="rounded-md border p-4 text-sm text-muted-foreground">Loading manager details...</div>
            )}

            {hasError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{data.message || "Failed to load manager details."}</div>
            )}

            {!isLoading && !isFetching && managerDetails && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-3 text-sm font-semibold">Manager Info</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {managerDetails.name || "N/A"}</p>
                      <p><span className="font-medium">Email:</span> {managerDetails.email || "N/A"}</p>
                      <p><span className="font-medium">Contact:</span> {managerDetails.contactNumber || "N/A"}</p>
                      <p><span className="font-medium">Gender:</span> {managerDetails.gender || "N/A"}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="mb-3 text-sm font-semibold">User Account</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">User Name:</span> {managerDetails.user?.name || "N/A"}</p>
                      <p><span className="font-medium">User Email:</span> {managerDetails.user?.email || "N/A"}</p>
                      <p><span className="font-medium">Status:</span> {managerDetails.user?.status || "N/A"}</p>
                      <p><span className="font-medium">Email Verified:</span> {managerDetails.user?.emailVerified ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ViewManagerProfileDialog