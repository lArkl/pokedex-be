import { Entity, Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Pokemon } from './Pokemon.entity'

@Entity()
export class PokemonMove {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => Pokemon, (pokemon: Pokemon) => pokemon.moves)
  pokemons: Pokemon[]
}
