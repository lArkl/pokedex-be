import { PokemonType } from '../entities'

export type PokemonsEntityDto = {
  pokemonName?: string
  pokemonTypeIds?: number[]
  pokemonAbilityIds?: number[]
  pokemonMoveIds?: number[]
  page: number
  pageSize: number
}

export type PokemonOutputDto = {
  id: number
  name: string
  spriteUrl: string | null
  types: PokemonType[]
}

export type ListEntityDto = {
  name?: string
  page: number
  pageSize: number
}
