import { AppDataSource } from '../db'
import { Pokemon } from '../entities/Pokemon.entity'
import { PokemonType } from '../entities/PokemonType.entity'

export const createPokemonType = async (typeName: string, pokemonEntities: Pokemon[]): Promise<void> => {
  const pokemonType = new PokemonType()
  pokemonType.name = typeName
  pokemonType.pokemons = pokemonEntities
  await AppDataSource.manager.save(pokemonType)
}

export const queryPokemonTypes = async () => {
  return await AppDataSource.getRepository(PokemonType).find()
}

export const queryPokemonType = async (id: number) => {
  return await AppDataSource.getRepository(PokemonType)
    .createQueryBuilder('pokemonType')
    .leftJoinAndSelect('pokemonType.pokemons', 'pokemon')
    .where('pokemonType.id = :id', { id })
    .select(['pokemon.id', 'pokemon.name', 'pokemonType'])
    .getOne()
}
