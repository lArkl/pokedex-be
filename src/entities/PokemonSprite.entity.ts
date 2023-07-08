import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm'
import { Pokemon } from './Pokemon.entity'

@Entity()
export class PokemonSprite {
  @PrimaryColumn()
  id: number

  @Column()
  category: string

  @Column()
  frontUrl: string

  @Column()
  backUrl: string

  @ManyToOne(() => Pokemon, (pokemon: Pokemon) => pokemon.sprites)
  pokemon: Pokemon
}
