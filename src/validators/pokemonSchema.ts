import { z } from 'zod'

export const pokemonsSchema = z.object({
  query: z.object({
    name: z.string().optional(),
    page: z.coerce.number().int().optional().default(0),
    pageSize: z.coerce.number().int().optional().default(20),
    abilities: z.coerce.number().int().array().optional(),
  }),
})

export const pokemonSchema = z.object({
  params: z.object({
    id: z.coerce.number().int(),
  }),
})
