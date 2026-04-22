"use client"

import { createManagerAction } from "@/app/(dashboardLayout)/admin/dashboard/content-management/_action"
import AppField from "@/components/shared/form/AppField"
import AppSubmitButton from "@/components/shared/form/AppSubmitButton"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Gender } from "@/types/contentManager.types"
import { createContentManagerFormZodSchema, ICreateContentManagerFormValues } from "@/zod/contentManager.validation"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { toast } from "sonner"

const defaultValues: ICreateContentManagerFormValues = {
  password: "",
  name: "",
  email: "",
  contactNumber: "",
  gender: Gender.MALE,
}

const CreateManagerFormModal = () => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync, isPending } = useMutation({ mutationFn: createManagerAction })

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const payload = {
        password: value.password,
        contentManager: {
          name: value.name,
          email: value.email,
          contactNumber: value.contactNumber,
          gender: value.gender,
        },
      } as const

      const result = await mutateAsync(payload)

      if (!result.success) {
        toast.error(result.message || "Failed to create manager")
        return
      }

      toast.success(result.message || "Manager created successfully")
      setOpen(false)
      form.reset()

      void queryClient.invalidateQueries({ queryKey: ["doctors"] })
      void queryClient.refetchQueries({ queryKey: ["doctors"], type: "active" })
      router.refresh()
    },
  })

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) form.reset()
  }, [form])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" className="ml-auto shrink-0">
          <Plus className="size-4" />
          Create Manager
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-5 pr-14">
          <DialogTitle>Create Manager</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-5.5rem)]">
          <div className="px-6 py-5">
            <form
              method="POST"
              action="#"
              noValidate
              onSubmit={(event) => {
                event.preventDefault()
                event.stopPropagation()
                form.handleSubmit()
              }}
              className="space-y-5"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <form.Field name="name" validators={{ onChange: createContentManagerFormZodSchema.shape.name }}>
                  {(field) => <AppField field={field} label="Full Name" placeholder="Enter manager name" />}
                </form.Field>

                <form.Field name="email" validators={{ onChange: createContentManagerFormZodSchema.shape.email }}>
                  {(field) => <AppField field={field} label="Email" type="email" placeholder="manager@example.com" />}
                </form.Field>

                <form.Field name="password" validators={{ onChange: createContentManagerFormZodSchema.shape.password }}>
                  {(field) => <AppField field={field} label="Password" type="password" placeholder="Enter temporary password" />}
                </form.Field>

                <form.Field name="contactNumber" validators={{ onChange: createContentManagerFormZodSchema.shape.contactNumber }}>
                  {(field) => <AppField field={field} label="Contact Number" placeholder="Enter contact number" />}
                </form.Field>

                <form.Field name="gender" validators={{ onChange: createContentManagerFormZodSchema.shape.gender }}>
                  {(field) => <AppField field={field} label="Gender" placeholder="MALE | FEMALE | OTHER" />}
                </form.Field>
              </div>

              <div className="flex items-center justify-end gap-3 border-t pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isPending}>
                    Cancel
                  </Button>
                </DialogClose>

                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
                  {([canSubmit, isSubmitting]) => (
                    <AppSubmitButton isPending={isSubmitting || isPending} pendingLabel="Creating manager..." disabled={!canSubmit} className="w-auto min-w-36">
                      Create Manager
                    </AppSubmitButton>
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

export default CreateManagerFormModal
