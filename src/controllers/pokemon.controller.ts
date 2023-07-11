import { PokemonOutputDto, PokemonsEntityDto } from '../dto/Pokemon.dto'
import { PaginationDto } from '../dto/Response.dto'
import { SpriteCategory } from '../entities/constants'
import { queryPokemons, queryPokemon } from '../repositories'

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

export const getPokemons = async (
  params: PokemonsEntityDto,
): Promise<Omit<PaginationDto<PokemonOutputDto>, 'pageSize' | 'page'>> => {
  const [pokemonList, count] = await queryPokemons(params)
  const { pageSize } = params
  const totalPages = Math.ceil(count / pageSize)
  return {
    items: pokemonList.map(({ id, name, mainSprite, types }) => ({ id, name, spriteUrl: mainSprite, types })),
    count,
    totalPages,
  }
}
