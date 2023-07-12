import { AppDataSource } from '../db'
import { PokemonsEntityDto } from '../dto/Pokemon.dto'
import { Pokemon } from '../entities/Pokemon.entity'
import { BasePokemon } from '../source/getPokemons'
import { getPaginationParams } from './utils'

export const createPokemon = async (basePokemon: BasePokemon): Promise<Pokemon> => {
  const pokemon = new Pokemon()
  pokemon.id = basePokemon.id
  pokemon.name = basePokemon.name
  pokemon.height = basePokemon.height
  pokemon.weight = basePokemon.weight
  pokemon.hp = basePokemon.stats.find((stat) => stat.name === 'hp')?.value ?? 0
  pokemon.attack = basePokemon.stats.find((stat) => stat.name === 'attack')?.value ?? 0
  pokemon.defense = basePokemon.stats.find((stat) => stat.name === 'defense')?.value ?? 0
  pokemon.specialAttack = basePokemon.stats.find((stat) => stat.name === 'special-attack')?.value ?? 0
  pokemon.specialDefense = basePokemon.stats.find((stat) => stat.name === 'special-defense')?.value ?? 0
  pokemon.speed = basePokemon.stats.find((stat) => stat.name === 'speed')?.value ?? 0
  pokemon.mainSprite = basePokemon.spriteUrl ?? null

  await AppDataSource.manager.save(pokemon)

  return pokemon
}

export const queryPokemons = async (params: PokemonsEntityDto): Promise<[Pokemon[], number]> => {
  const { pokemonName, pokemonAbilityIds, pokemonTypeIds, pokemonMoveIds, page, pageSize } = params
  const { skip, take } = getPaginationParams(page, pageSize)

  let query = AppDataSource.getRepository(Pokemon)
    .createQueryBuilder('pokemon')
    .leftJoin('pokemon.types', 'pokemonType')

  if (pokemonName) {
    query = query.andWhere('instr(pokemon.name,:pokemonName)', { pokemonName })
  }
  if (pokemonAbilityIds) {
    query = query
      .leftJoin('pokemon.abilities', 'pokemonAbility')
      .andWhere('pokemonAbility.id IN (:...pokemonAbilityIds)', { pokemonAbilityIds })
  }
  if (pokemonTypeIds) {
    query = query.andWhere('pokemonType.id IN (:...pokemonTypeIds)', { pokemonTypeIds })
  }
  if (pokemonMoveIds) {
    query = query
      .leftJoin('pokemon.moves', 'pokemonMove')
      .andWhere('pokemonMove.id IN (:...pokemonMoveIds)', { pokemonMoveIds })
  }

  return query
    .select(['pokemon.id', 'pokemon.name', 'pokemon.mainSprite', 'pokemonType'])
    .take(take)
    .skip(skip)
    .getManyAndCount()
}

export const queryPokemon = async (id: number): Promise<Pokemon | null> => {
  return await AppDataSource.getRepository(Pokemon).findOne({
    relations: { sprites: true, moves: true, abilities: true, types: true },
    where: { id },
  })
}
