import { SpriteCategory } from '../entities/constants'
import {
  queryPokemons,
  queryPokemonAbilities,
  queryPokemonMoves,
  queryPokemonSprites,
  queryPokemonTypes,
  queryPokemon,
  queryPokemonType,
} from '../repositories'

export const getPokemon = async (id: number) => {
  return queryPokemon(id).then((pokemon) => {
    if (!pokemon) return {}
    const { sprites, mainSprite, hp, attack, defense, specialAttack, specialDefense, speed, ...pokemonFields } = pokemon
    const defaultSprite = sprites[SpriteCategory.Default]
    const shinySprite = sprites[SpriteCategory.Shiny]
    return {
      ...pokemonFields,
      spriteUrl: mainSprite,
      stats: {
        hp,
        attack,
        defense,
        specialAttack,
        specialDefense,
        speed,
      },
      sprites: {
        default: {
          backUrl: defaultSprite.backUrl,
          frontUrl: defaultSprite.frontUrl,
        },
        shiny: {
          backUrl: shinySprite.backUrl,
          frontUrl: shinySprite.frontUrl,
        },
      },
    }
  })
}

type PokemonsSelectParams = Partial<{
  pokemonName: string
  pokemonTypeIds: number[]
  pokemonAbilityIds: number[]
  pokemonMoveIds: number[]
}>
export const getPokemons = async (page: number, pageSize: number, params?: PokemonsSelectParams) => {
  return queryPokemons(page, pageSize, params)
}

// export const getPokemonSprites = async (page = 0, pageSize) => {
//   return queryPokemonSprites(page, pageSize)
// }

// export const getPokemonMoves = async (page = 0, pageSize) => {
//   return queryPokemonMoves(page, pageSize)
// }

export const getPokemonTypes = async () => {
  return queryPokemonTypes()
}

export const getPokemonType = async (id: number) => {
  return queryPokemonType(id)
}

// export const getPokemonAbilities = async (page = 0, pageSize) => {
//   return queryPokemonAbilities(page, pageSize)
// }
