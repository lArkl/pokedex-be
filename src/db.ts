import { DataSource } from 'typeorm'
import { Pokemon, PokemonAbility, PokemonMove, PokemonSprite, PokemonType } from './entities'

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: './main.sqlite3',
  synchronize: true,
  logging: true,
  entities: [Pokemon, PokemonAbility, PokemonMove, PokemonSprite, PokemonType],
  subscribers: [],
  migrations: [],
})

AppDataSource.initialize().catch((error) => console.log(error))
