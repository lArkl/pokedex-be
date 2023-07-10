import { AppDataSource } from '../db'
import { Pokemon } from '../entities/Pokemon.entity'
import { BasePokemon } from '../source/getPokemons'

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

type PokemonsSelectParams = Partial<{
  pokemonName: string
  pokemonTypeIds: number[]
  pokemonAbilityIds: number[]
  pokemonMoveIds: number[]
}>

export const queryPokemons = async (
  page: number,
  pageSize: number,
  params: PokemonsSelectParams = {},
): Promise<Pokemon[]> => {
  let query = AppDataSource.getRepository(Pokemon).createQueryBuilder('pokemon')
  const { pokemonName, pokemonAbilityIds, pokemonTypeIds, pokemonMoveIds } = params

  if (pokemonName) {
    query = query.andWhere('instr(pokemon.name,:pokemonName)', { pokemonName })
  }
  if (pokemonAbilityIds) {
    query = query
      .leftJoin('pokemon.abilities', 'pokemonAbility')
      .andWhere('pokemonAbility.id IN (:...pokemonAbilityIds)', { pokemonAbilityIds })
  }
  if (pokemonTypeIds) {
    query = query
      .leftJoin('pokemon.types', 'pokemonType')
      .andWhere('pokemonType.id IN (:...pokemonTypeIds)', { pokemonTypeIds })
  }
  if (pokemonMoveIds) {
    query = query
      .leftJoin('pokemon.moves', 'pokemonMove')
      .andWhere('pokemonMove.id IN (:...pokemonMoveIds)', { pokemonMoveIds })
  }

  return query
    .leftJoinAndSelect('pokemon.types', 'pokemonType')
    .select(['pokemon.id', 'pokemon.name', 'pokemonType'])
    .take(pageSize)
    .skip(page * pageSize)
    .getMany()
}

export const queryPokemon = async (id: number): Promise<Pokemon | null> => {
  return await AppDataSource.getRepository(Pokemon).findOne({
    relations: { sprites: true, moves: true, abilities: true, types: true },
    where: { id },
  })
}
