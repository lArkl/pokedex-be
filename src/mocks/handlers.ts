import { rest } from 'msw'
import pokemonsListJson1 from './responses/pokemons1.json'
import pokemonJson from './responses/pokemon.json'
import { Pokemon } from '../source/types'

export const handlers = [
  rest.get('https://pokeapi.co/api/v2/pokemon/:id', (req, res, ctx) => {
    const { id } = req.params
    const pokemon: Pokemon = pokemonJson

    return res(ctx.status(200), ctx.json({ ...pokemon, name: `${pokemon.name}${id}`, id }))
  }),
  rest.get('https://pokeapi.co/api/v2/pokemon', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(pokemonsListJson1))
  }),
]
