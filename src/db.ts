import { DataSource } from 'typeorm'
import { Pokemon, PokemonAbility, PokemonMove, PokemonSprite, PokemonType } from './entities'
import { User } from './entities/User.entity'

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: './main.sqlite3',
  synchronize: true,
  logging: false,
  entities: [Pokemon, PokemonAbility, PokemonMove, PokemonSprite, PokemonType, User],
  subscribers: [],
  migrations: [],
})

AppDataSource.initialize().catch((error) => console.log(error))
