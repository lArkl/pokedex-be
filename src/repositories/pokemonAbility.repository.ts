import { AppDataSource } from '../db'
import { ListEntityDto } from '../dto/Pokemon.dto'
import { Pokemon } from '../entities/Pokemon.entity'
import { PokemonAbility } from '../entities/PokemonAbility.entity'
import { getPaginationParams } from './utils'

export const createPokemonAbility = async (abilityName: string, pokemonEntities: Pokemon[]): Promise<void> => {
  const ability = new PokemonAbility()
  ability.name = abilityName
  ability.pokemons = pokemonEntities
  await AppDataSource.manager.save(ability)
}

export const queryPokemonAbilities = async ({ page, pageSize, name }: ListEntityDto) => {
  let query = AppDataSource.getRepository(PokemonAbility).createQueryBuilder('pokemonAbility')
  if (name) {
    query = query.where('instr(pokemonAbility.name,:name)', { name })
  }
  const { take, skip } = getPaginationParams(page, pageSize)
  return query.select(['pokemonAbility.id', 'pokemonAbility.name']).take(take).skip(skip).getManyAndCount()
}
