"use server"

import { createManager, deleteManager, getManagerById, updateManager } from "@/services/contentManager.services"
import { type ApiErrorResponse, type ApiResponse } from "@/types/api.type"
import { type ICreateContentManagerPayload, type IContentManager, type IContentManagerDetails, type IUpdateContentManagerPayload } from "@/types/contentManager.types"
import { createContentManagerServerZodSchema, updateContentManagerServerZodSchema } from "@/zod/contentManager.validation"

const getActionErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}

export const createManagerAction = async (
  payload: ICreateContentManagerPayload,
): Promise<ApiResponse<IContentManager> | ApiErrorResponse> => {
  const parsedPayload = createContentManagerServerZodSchema.safeParse(payload)

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0]?.message || "Invalid input",
    }
  }

  try {
    return await createManager(parsedPayload.data)
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error, "Failed to create doctor"),
    }
  }
}

export const updateManagerAction = async (
  id: string,
  payload: IUpdateContentManagerPayload,
): Promise<ApiResponse<IContentManager> | ApiErrorResponse> => {
  const parsedPayload = updateContentManagerServerZodSchema.safeParse(payload)

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0]?.message || "Invalid input",
    }
  }

  try {
    return await updateManager(id, parsedPayload.data)
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error, "Failed to update doctor"),
    }
  }
}

export const deleteManagerAction = async (
  id: string,
): Promise<ApiResponse<{ message: string }> | ApiErrorResponse> => {
  if (!id) {
    return {
      success: false,
      message: "Invalid manager id",
    }
  }

  try {
    return await deleteManager(id)
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error, "Failed to delete manager"),
    }
  }
}

export const getManagerByIdAction = async (
  id: string,
): Promise<ApiResponse<IContentManagerDetails> | ApiErrorResponse> => {
  if (!id) {
    return {
      success: false,
      message: "Invalid manager id",
    }
  }

  try {
    return await getManagerById(id)
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error, "Failed to fetch manager details"),
    }
  }
}