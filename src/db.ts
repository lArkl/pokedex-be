import { DataSource } from 'typeorm'
import { Pokemon, PokemonAbility, PokemonMove, PokemonSprite, PokemonType } from './entities'
import { User } from './entities/User.entity'
import { Session } from './entities/Session.entity'

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: './main.sqlite3',
  synchronize: true,
  logging: ['info'],
  entities: [Pokemon, PokemonAbility, PokemonMove, PokemonSprite, PokemonType, User, Session],
  subscribers: [],
  migrations: [],
})

AppDataSource.initialize().catch((error) => console.log(error))
