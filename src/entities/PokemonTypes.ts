import { Entity, Column, PrimaryColumn, ManyToMany } from 'typeorm'
import { Pokemon } from './Pokemon.entity'

@Entity()
export class PokemonType {
  @PrimaryColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => Pokemon, (pokemon: Pokemon) => pokemon.types)
  pokemons: Pokemon[]
}
