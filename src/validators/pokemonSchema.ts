import { z } from 'zod'

export const pokemonsSchema = z.object({
  query: z.object({
    name: z.string().optional(),
    page: z.coerce.number().int().optional().default(1),
    pageSize: z.coerce.number().int().optional().default(20),
    abilities: z.coerce.number().int().array().optional(),
    types: z.coerce.number().int().array().optional(),
  }),
})

export const pokemonSchema = z.object({
  params: z.object({
    id: z.coerce.number().int(),
  }),
})

export const typesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().optional().default(1),
    pageSize: z.coerce.number().int().optional().default(20),
  }),
})

export const abilitiesSchema = z.object({
  query: z.object({
    name: z.string().optional(),
    page: z.coerce.number().int().optional().default(1),
    pageSize: z.coerce.number().int().optional().default(20),
  }),
})
