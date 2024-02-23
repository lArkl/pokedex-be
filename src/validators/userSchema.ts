import { z } from 'zod'

const userSchemaobject = z.object({
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(),
  email: z.string().email(),
})

export const createUserSchema = z.object({
  body: userSchemaobject,
})

export const updateUserSchema = z.object({
  params: z.object({
    id: z.coerce.number().int(),
  }),
  body: userSchemaobject.partial(),
})

export const signUserSchema = z.object({
  body: z.object({
    password: z.string(),
    email: z.string().email(),
  }),
})
