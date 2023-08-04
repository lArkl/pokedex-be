import { Router } from 'express'
import { getPokemon, getPokemonAbilities, getPokemonTypes, getPokemons } from '../controllers/pokemon.controller'
import { PokemonOutputDto } from '../dto/Pokemon.dto'
import { ListItemOutpuDto, PaginatedResponseDto, ResponseDto } from '../dto/Response.dto'
import { abilitiesSchema, pokemonSchema, pokemonsSchema, zParse } from '../validators'

const router = Router()

router.get('/pokemon/:id', async (req, res, next) => {
  try {
    const {
      params: { id },
    } = await zParse(pokemonSchema, req)
    const pokemon = await getPokemon(id)

    const response: ResponseDto<typeof pokemon> = { data: pokemon, error: null }
    res.json(response)
  } catch (err) {
    next(err)
  }
})

router.get('/pokemons', async (req, res, next) => {
  try {
    const {
      query: { page, pageSize, name, abilities, types },
    } = await zParse(pokemonsSchema, req)

    const { items, count } = await getPokemons({
      page,
      pageSize,
      pokemonName: name,
      pokemonAbilityIds: abilities,
      pokemonTypeIds: types,
    })
    const response: PaginatedResponseDto<PokemonOutputDto> = {
      data: {
        items,
        count,
        page,
        pageSize,
      },
      error: null,
    }
    return res.json(response)
  } catch (err) {
    next(err)
  }
})

router.get('/types', async (req, res, next) => {
  try {
    const pokemonTypes = await getPokemonTypes()
    const response: ResponseDto<ListItemOutpuDto[]> = {
      data: pokemonTypes,
      error: null,
    }
    return res.json(response)
  } catch (err) {
    next(err)
  }
})

router.get('/abilities', async (req, res, next) => {
  try {
    const {
      query: { page, pageSize, name, ids },
    } = await zParse(abilitiesSchema, req)
    const { count, items } = await getPokemonAbilities({ page, pageSize, name, ids })
    const response: PaginatedResponseDto<ListItemOutpuDto> = {
      data: {
        items,
        count,
        page,
        pageSize,
      },
      error: null,
    }
    return res.json(response)
  } catch (err) {
    next(err)
  }
})

export default router
