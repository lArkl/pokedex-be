import axios from 'axios'
import { ListEntry, PaginatedResult, Pokemon as PokemonEntry } from './types'
import { SOURCE_API_ENDPOINT } from './config'

export interface BaseSprite {
  frontUrl: string
  backUrl: string
}

export interface BasePokemon {
  name: string
  spriteUrl?: string
  sprites: { default: BaseSprite; shiny: BaseSprite }
  abilites: string[]
  types: string[]
  stats: Array<{ name: string; value: number }>
  moves: string[]
  height: number
  weight: number
  id: number
}

export const parsePokemon = (response: PokemonEntry): BasePokemon => ({
  id: response.id,
  name: response.name,
  spriteUrl: response.sprites.other?.dream_world.front_default,
  sprites: {
    default: { frontUrl: response.sprites.front_default, backUrl: response.sprites.back_default },
    shiny: { frontUrl: response.sprites.front_shiny, backUrl: response.sprites.back_shiny },
  },
  stats: response.stats.map((stat) => ({ value: stat.base_stat, name: stat.stat.name })),
  abilites: response.abilities.map((abl) => abl.ability.name),
  types: response.types.map((pokemonType) => pokemonType.type.name),
  moves: response.moves.map((move) => move.move.name),
  weight: response.weight / 10,
  height: response.height / 10,
})

export const getPokemonFromId = async (id: number) => {
  const { data } = await axios.get<PokemonEntry>(`${SOURCE_API_ENDPOINT}/pokemon/${id}`)
  return parsePokemon(data)
}

export const getPokemonFromUrl = async (url: string): Promise<BasePokemon> => {
  const { data } = await axios.get<PokemonEntry>(url)
  return parsePokemon(data)
}

export const PAGE_SIZE = 20
export const getPokemonsList = async (page = 0): Promise<PaginatedResult<BasePokemon>> => {
  const offset = page * PAGE_SIZE
  const { data: response } = await axios.get<PaginatedResult<ListEntry>>(`${SOURCE_API_ENDPOINT}/pokemon`, {
    params: { offset },
  })
  const pokemonsEntries = await Promise.all(response.results.map((result) => getPokemonFromUrl(result.url)))
  return {
    ...response,
    results: pokemonsEntries,
  }
}
