import { Gender, type ICreateContentManagerPayload, type IUpdateContentManagerPayload } from "@/types/contentManager.types"
import { z } from "zod"

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined
  }

  return value
}

export const createContentManagerFormZodSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
  name: z
    .string()
    .trim()
    .min(5, "Name must be at least 5 characters")
    .max(30, "Name must be at most 30 characters"),
  email: z.email("Invalid email address"),
  contactNumber: z
    .string()
    .trim()
    .min(11, "Contact number must be at least 11 characters")
    .max(14, "Contact number must be at most 14 characters"),
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER], {
    message: "Gender must be MALE, FEMALE, or OTHER",
  }),
})

export const createContentManagerServerZodSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
  contentManager: z.object({
    name: z
      .string()
      .trim()
      .min(5, "Name must be at least 5 characters")
      .max(30, "Name must be at most 30 characters"),
    email: z.email("Invalid email address"),
    contactNumber: z
      .string()
      .trim()
      .min(11, "Contact number must be at least 11 characters")
      .max(14, "Contact number must be at most 14 characters"),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER], {
      message: "Gender must be MALE, FEMALE, or OTHER",
    }),
  }),
}) satisfies z.ZodType<ICreateContentManagerPayload>

export const editContentManagerFormZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, "Name must be at least 5 characters")
    .max(30, "Name must be at most 30 characters"),
  contactNumber: z
    .string()
    .trim()
    .min(11, "Contact number must be at least 11 characters")
    .max(14, "Contact number must be at most 14 characters"),
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER], {
    message: "Gender must be MALE, FEMALE, or OTHER",
  }),
})

export const updateContentManagerServerZodSchema = z.object({
  contentManager: z
    .object({
      name: z
        .string()
        .trim()
        .min(5, "Name must be at least 5 characters")
        .max(30, "Name must be at most 30 characters")
        .optional(),
      contactNumber: z
        .string()
        .trim()
        .min(11, "Contact number must be at least 11 characters")
        .max(14, "Contact number must be at most 14 characters")
        .optional(),
      gender: z
        .enum([Gender.MALE, Gender.FEMALE, Gender.OTHER], {
          message: "Gender must be MALE, FEMALE, or OTHER",
        })
        .optional(),
    })
    .optional(),
}) satisfies z.ZodType<IUpdateContentManagerPayload>

export type ICreateContentManagerFormValues = z.infer<typeof createContentManagerFormZodSchema>
export type IEditContentManagerFormValues = z.infer<typeof editContentManagerFormZodSchema>