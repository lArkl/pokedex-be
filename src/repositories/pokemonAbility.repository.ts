import { AppDataSource } from '../db'
import { Pokemon } from '../entities/Pokemon.entity'
import { PokemonAbility } from '../entities/PokemonAbility.entity'
import { getPaginationParams } from './utils'

export const createPokemonAbility = async (abilityName: string, pokemonEntities: Pokemon[]): Promise<void> => {
  const ability = new PokemonAbility()
  ability.name = abilityName
  ability.pokemons = pokemonEntities
  await AppDataSource.manager.save(ability)
}

export const queryPokemonAbilities = async (page: number, pageSize: number) => {
  return await AppDataSource.getRepository(PokemonAbility).find({
    ...getPaginationParams(page, pageSize),
    relations: { pokemons: true },
  })
}
