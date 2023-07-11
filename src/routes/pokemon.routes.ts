import { Router } from 'express'
import { getPokemon, getPokemons } from '../controllers/pokemon.controller'
import { PokemonOutputDto } from '../dto/Pokemon.dto'
import { PaginatedResponseDto, ResponseDto } from '../dto/Response.dto'
import { pokemonSchema, pokemonsSchema, zParse } from '../validators'

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
      query: { page, pageSize, name, abilities },
    } = await zParse(pokemonsSchema, req)

    const { items, count, totalPages } = await getPokemons({
      page,
      pageSize,
      pokemonName: name,
      pokemonAbilityIds: abilities,
    })
    const response: PaginatedResponseDto<PokemonOutputDto> = {
      data: {
        items,
        count,
        page,
        pageSize,
        totalPages,
      },
      error: null,
    }
    return res.json(response)
  } catch (err) {
    next(err)
  }
})

export default router
