import {
  createContentManagerFormZodSchema,
  createContentManagerServerZodSchema,
  editContentManagerFormZodSchema,
  updateContentManagerServerZodSchema,
  type ICreateContentManagerFormValues,
  type IEditContentManagerFormValues,
} from "@/zod/contentManager.validation"

// Compatibility layer:
// Some Admin UI modules were originally built around "Doctor" naming.
// The app now uses Content Manager validation, but we keep these exports
// so existing imports continue to work without large refactors.

export const createDoctorFormZodSchema = createContentManagerFormZodSchema
export const createDoctorServerZodSchema = createContentManagerServerZodSchema

export const editDoctorFormZodSchema = editContentManagerFormZodSchema
export const updateDoctorServerZodSchema = updateContentManagerServerZodSchema

export type ICreateDoctorFormValues = ICreateContentManagerFormValues
export type IEditDoctorFormValues = IEditContentManagerFormValues

