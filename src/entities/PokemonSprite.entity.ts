import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Pokemon } from './Pokemon.entity'

@Entity()
export class PokemonSprite {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  category: number

  @Column()
  frontUrl: string

  @Column()
  backUrl: string

  @ManyToOne(() => Pokemon, (pokemon: Pokemon) => pokemon.sprites)
  pokemon: Pokemon
}
