import { Pokemon } from '../entities/Pokemon.entity'
import { SpriteCategory } from '../entities/constants'
import {
  createPokemon,
  createPokemonAbility,
  createPokemonMove,
  createPokemonSprite,
  createPokemonType,
} from '../repositories'
import { BasePokemon, getPokemonsList } from './getPokemons'
import { PaginatedResult } from './types'

const storePokemons = async (
  basePokemons: PaginatedResult<BasePokemon>['results'],
): Promise<Record<string, Pokemon>> => {
  const pokemonNameToEntity: Record<string, Pokemon> = {}
  for (const pokemon of basePokemons) {
    pokemonNameToEntity[pokemon.name] = await createPokemon(pokemon)
  }
  return pokemonNameToEntity
}

type ArrayProperties<T> = keyof Pick<
  T,
  {
    [K in keyof T]: T[K] extends string[] ? K : never
  }[keyof T]
>

const getPropertyToPokemonsEntries = (
  property: Exclude<ArrayProperties<BasePokemon>, undefined>,
  basePokemons: PaginatedResult<BasePokemon>['results'],
  pokemonNameToEntity: Record<string, Pokemon>,
): Array<[string, Pokemon[]]> => {
  const propertyNameToPokemon = basePokemons.reduce<Record<string, Pokemon[]>>((propertyToPokemon, basePokemon) => {
    basePokemon[property].forEach((moveName) => {
      if (!propertyToPokemon[moveName]) {
        propertyToPokemon[moveName] = []
      }
      propertyToPokemon[moveName].push(pokemonNameToEntity[basePokemon.name])
    })
    return propertyToPokemon
  }, {})

  return Object.entries(propertyNameToPokemon)
}

const storeMoves = async (
  basePokemons: PaginatedResult<BasePokemon>['results'],
  pokemonNameToEntity: Record<string, Pokemon>,
): Promise<void> => {
  const movesToPokemonEntries = getPropertyToPokemonsEntries('moves', basePokemons, pokemonNameToEntity)
  movesToPokemonEntries.forEach(async ([moveName, pokemonEntities]) => {
    await createPokemonMove(moveName, pokemonEntities)
  })
}

const storeAbilities = async (
  basePokemons: PaginatedResult<BasePokemon>['results'],
  pokemonNameToEntity: Record<string, Pokemon>,
): Promise<void> => {
  const abilitiesToPokemonEntries = getPropertyToPokemonsEntries('abilites', basePokemons, pokemonNameToEntity)
  abilitiesToPokemonEntries.forEach(async ([abilityName, pokemonEntities]) => {
    await createPokemonAbility(abilityName, pokemonEntities)
  })
}

const storeTypes = async (
  basePokemons: PaginatedResult<BasePokemon>['results'],
  pokemonNameToEntity: Record<string, Pokemon>,
): Promise<void> => {
  const typesToPokemonEntries = getPropertyToPokemonsEntries('types', basePokemons, pokemonNameToEntity)
  typesToPokemonEntries.forEach(async ([abilityName, pokemonEntities]) => {
    await createPokemonType(abilityName, pokemonEntities)
  })
}

const storeSprites = async (
  basePokemons: PaginatedResult<BasePokemon>['results'],
  pokemonNameToEntity: Record<string, Pokemon>,
) => {
  basePokemons.forEach(async (basePokemon) => {
    const pokemonEntity = pokemonNameToEntity[basePokemon.name]

    await createPokemonSprite(SpriteCategory.Default, basePokemon.sprites.default, pokemonEntity)
    await createPokemonSprite(SpriteCategory.Shiny, basePokemon.sprites.shiny, pokemonEntity)
  })
}

const scrape = async () => {
  const pokemonRequests: Promise<PaginatedResult<BasePokemon>>[] = []

  for (let page = 0; page < 64; page++) {
    pokemonRequests.push(getPokemonsList(page))
  }

  const responses = await Promise.all(pokemonRequests)
  const basePokemons = responses.flatMap((response) => response.results)

  const pokemonNameToEntity = await storePokemons(basePokemons)

  await storeSprites(basePokemons, pokemonNameToEntity)

  await storeMoves(basePokemons, pokemonNameToEntity)
  await storeAbilities(basePokemons, pokemonNameToEntity)
  await storeTypes(basePokemons, pokemonNameToEntity)
}

scrape()
