import { Entity, Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Pokemon } from './Pokemon.entity'

@Entity()
export class PokemonAbility {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => Pokemon, (pokemon: Pokemon) => pokemon.abilities)
  pokemons: Pokemon[]
}
