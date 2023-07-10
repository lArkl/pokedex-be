import { AppDataSource } from '../db'
import { Pokemon } from '../entities/Pokemon.entity'
import { PokemonMove } from '../entities/PokemonMove.entity'
import { getPaginationParams } from './utils'

export const createPokemonMove = async (moveName: string, pokemonEntities: Pokemon[]): Promise<void> => {
  const move = new PokemonMove()
  move.name = moveName
  move.pokemons = pokemonEntities
  await AppDataSource.manager.save(move)
}

export const queryPokemonMoves = async (page: number, pageSize: number) => {
  return await AppDataSource.getRepository(PokemonMove).find({
    ...getPaginationParams(page, pageSize),
    relations: { pokemons: true },
  })
}
