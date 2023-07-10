import { AppDataSource } from '../db'
import { Pokemon } from '../entities/Pokemon.entity'
import { PokemonSprite } from '../entities/PokemonSprite.entity'
import { SpriteCategory } from '../entities/constants'
import { BaseSprite } from '../source/getPokemons'
import { getPaginationParams } from './utils'

export const createPokemonSprite = async (
  category: SpriteCategory,
  basePokemonSprite: BaseSprite,
  pokemonEntity: Pokemon,
): Promise<void> => {
  const pokemonSprite = new PokemonSprite()
  pokemonSprite.category = category
  pokemonSprite.backUrl = basePokemonSprite.backUrl
  pokemonSprite.frontUrl = basePokemonSprite.frontUrl
  pokemonSprite.pokemon = pokemonEntity

  await AppDataSource.manager.save(pokemonSprite)
}

export const queryPokemonSprites = async (page: number, pageSize: number) => {
  return await AppDataSource.getRepository(PokemonSprite).find({
    ...getPaginationParams(page, pageSize),
    relations: { pokemon: true },
  })
}
