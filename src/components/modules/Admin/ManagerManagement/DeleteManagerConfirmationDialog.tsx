"use client"

import { deleteManagerAction } from "@/app/(dashboardLayout)/admin/dashboard/content-management/_action"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { type IContentManager } from "@/types/contentManager.types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DeleteManagerConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  manager: IContentManager | null
}

const DeleteManagerConfirmationDialog = ({
  open,
  onOpenChange,
  manager,
}: DeleteManagerConfirmationDialogProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteManagerAction,
  })

  const handleConfirmDelete = async () => {
    if (!manager) {
      toast.error("Manager not found")
      return
    }

    const result = await mutateAsync(String(manager.id))

    if (!result.success) {
      toast.error(result.message || "Failed to delete manager ")
      return
    }

    toast.success(result.message || "Manager deleted successfully")
    onOpenChange(false)

    void queryClient.invalidateQueries({ queryKey: ["doctors"] })
    void queryClient.refetchQueries({ queryKey: ["doctors"], type: "active" })
    router.refresh()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Manager</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {manager?.name ?? "this manager"}? This action will mark the manager and linked user as deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(event) => {
              event.preventDefault()
              void handleConfirmDelete()
            }}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteManagerConfirmationDialog