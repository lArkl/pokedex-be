import { Entity, Column, PrimaryColumn, ManyToMany } from 'typeorm'
import { Pokemon } from './Pokemon.entity'

@Entity()
export class PokemonAbility {
  @PrimaryColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => Pokemon, (pokemon: Pokemon) => pokemon.sprites)
  pokemons: Pokemon[]
}
