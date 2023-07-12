import { ListEntityDto, PokemonOutputDto, PokemonsEntityDto } from '../dto/Pokemon.dto'
import { ListItemOutpuDto, PaginationDto } from '../dto/Response.dto'
import { SpriteCategory } from '../entities/constants'
import { queryPokemons, queryPokemon, queryPokemonTypes, queryPokemonAbilities } from '../repositories'

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

export const getPokemons = async (params: PokemonsEntityDto): Promise<PaginationDto<PokemonOutputDto>> => {
  const [pokemonList, count] = await queryPokemons(params)
  const { pageSize, page } = params
  return {
    items: pokemonList.map(({ id, name, mainSprite, types }) => ({ id, name, spriteUrl: mainSprite, types })),
    count,
    page,
    pageSize,
  }
}

export const getPokemonTypes = async (): Promise<ListItemOutpuDto[]> => {
  const pokemonTypes = await queryPokemonTypes()
  return pokemonTypes
}

export const getPokemonAbilities = async ({
  page,
  pageSize,
  name,
}: ListEntityDto): Promise<PaginationDto<ListItemOutpuDto>> => {
  const [pokemonAbilities, count] = await queryPokemonAbilities({ page, pageSize, name })
  return {
    items: pokemonAbilities,
    count,
    page,
    pageSize,
  }
}
