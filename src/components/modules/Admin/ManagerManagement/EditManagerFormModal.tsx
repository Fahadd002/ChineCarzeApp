/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { updateManagerAction } from "@/app/(dashboardLayout)/admin/dashboard/content-management/_action"
import AppField from "@/components/shared/form/AppField"
import AppSubmitButton from "@/components/shared/form/AppSubmitButton"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Gender, type IContentManager, type IUpdateContentManagerPayload } from "@/types/contentManager.types"
import { editContentManagerFormZodSchema, IEditContentManagerFormValues } from "@/zod/contentManager.validation"

import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

interface EditManagerFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  manager: IContentManager | null
}

const getInitialValues = (manager: IContentManager | null): IEditContentManagerFormValues => ({
  name: manager?.name ?? "",
  contactNumber: manager?.contactNumber ?? "",
  gender: manager?.gender ?? Gender.MALE,
})

const EditDoctorFormModal = ({ open, onOpenChange, manager }: EditManagerFormModalProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ managerId, payload }: { managerId: string; payload: IUpdateContentManagerPayload }) =>
      updateManagerAction(managerId, payload as any),
  })

  const form = useForm({
    defaultValues: getInitialValues(manager),
    onSubmit: async ({ value }) => {
      if (!manager) {
        toast.error("Manager not found")
        return
      }

      const payload: IUpdateContentManagerPayload = {
        contentManager: {
          name: value.name,
          contactNumber: value.contactNumber,
          gender: value.gender,
        },
      }

      const result = await mutateAsync({ managerId: String(manager.id), payload } as any)

      if (!result.success) {
        toast.error(result.message || "Failed to update manager")
        return
      }

      toast.success(result.message || "Manager updated successfully")
      onOpenChange(false)

      void queryClient.invalidateQueries({ queryKey: ["doctors"] })
      void queryClient.refetchQueries({ queryKey: ["doctors"], type: "active" })
      router.refresh()
    },
  })

  useEffect(() => {
    if (open) {
      form.reset(getInitialValues(manager))
    }
  }, [manager, form, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-5 pr-14">
          <DialogTitle>Edit Manager</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-5.5rem)]">
          <div className="px-6 py-5">
            <form method="POST" action="#" noValidate onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <form.Field name="name" validators={{ onChange: editContentManagerFormZodSchema.shape.name }}>
                  {(field) => <AppField field={field} label="Full Name" placeholder="Enter manager name" />}
                </form.Field>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email</label>
                  <div className="bg-muted text-muted-foreground rounded-md border px-3 py-2 text-sm">{manager?.email ?? "N/A"}</div>
                </div>

                <form.Field name="contactNumber" validators={{ onChange: editContentManagerFormZodSchema.shape.contactNumber }}>
                  {(field) => <AppField field={field} label="Contact Number" placeholder="Enter contact number" />}
                </form.Field>

                <form.Field name="gender" validators={{ onChange: editContentManagerFormZodSchema.shape.gender }}>
                  {(field) => <AppField field={field} label="Gender" placeholder="MALE | FEMALE | OTHER" />}
                </form.Field>
              </div>

              <div className="flex items-center justify-end gap-3 border-t pt-4">
                <Button type="button" variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}>Cancel</Button>
                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
                  {([canSubmit, isSubmitting]) => (
                    <AppSubmitButton isPending={isSubmitting || isPending} pendingLabel="Updating manager..." disabled={!canSubmit} className="w-auto min-w-36">Update Manager</AppSubmitButton>
                  )}
                </form.Subscribe>
              </div>
            </form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default EditDoctorFormModal