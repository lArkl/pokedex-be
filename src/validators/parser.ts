import type { Request } from 'express'
import { AnyZodObject, ZodError, z } from 'zod'

export async function zParse<T extends AnyZodObject>(schema: T, req: Request): Promise<z.infer<T>> {
  try {
    return schema.parse(req)
  } catch (error) {
    if (error instanceof ZodError) {
      throw error.message
    }
    throw error
  }
}
