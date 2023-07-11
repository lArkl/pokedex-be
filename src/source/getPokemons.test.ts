import { describe, it, expect } from 'vitest'
import { getPokemonFromId, getPokemonFromUrl, getPokemonsList } from './getPokemons'

describe('getPokemons', () => {
  const pokemonMock = {
    id: '1',
    name: 'bulbasaur1',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg',
    sprites: {
      default: {
        frontUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        backUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
      },
      shiny: {
        frontUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png',
        backUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png',
      },
    },
    stats: [
      { value: 45, name: 'hp' },
      { value: 49, name: 'attack' },
      { value: 49, name: 'defense' },
      { value: 65, name: 'special-attack' },
      { value: 65, name: 'special-defense' },
      { value: 45, name: 'speed' },
    ],
    abilites: ['overgrow', 'chlorophyll'],
    types: ['grass', 'poison'],
    moves: ['razor-wind', 'swords-dance'],
    weight: 6.9,
    height: 0.7,
  }

  describe('getPokemonFromId', () => {
    it('returns pokemon data from id', async () => {
      const data = await getPokemonFromId(1)

      expect(data).toEqual(pokemonMock)
    })
  })

  describe('getPokemonFromUrl', () => {
    it('returns pokemon data from url', async () => {
      const data = await getPokemonFromUrl('https://pokeapi.co/api/v2/pokemon/1')
      expect(data).toEqual(pokemonMock)
    })
  })
  describe('getPokemonsList', () => {
    it('returns pokemon list', async () => {
      const list = await getPokemonsList()

      expect(list.results).toHaveLength(2)
      expect(list.results[0]).toEqual(pokemonMock)
    })

    it('returns pokemon list for page', async () => {
      const list = await getPokemonsList(1)

      expect(list.results).toHaveLength(2)
      expect(list.results[0]).toEqual(pokemonMock)
    })
  })
})
