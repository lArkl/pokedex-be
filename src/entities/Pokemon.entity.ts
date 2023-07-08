import { Entity, Column, PrimaryColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm'
import { PokemonSprite } from './PokemonSprite.entity'
import { PokemonAbility } from './PokemonAbility.entity'
import { PokemonMove } from './PokemonMove.entity'
import { PokemonType } from './PokemonTypes'

@Entity()
export class Pokemon {
  @PrimaryColumn()
  id: number

  @Column()
  name: string

  @Column('float')
  height: number

  @Column('float')
  weight: number

  @Column()
  hp: number

  @Column()
  attack: number

  @Column()
  defense: number

  @Column()
  specialAttack: number

  @Column()
  specialDefense: number

  @Column()
  speed: number

  @OneToMany(() => PokemonSprite, (sprite: PokemonSprite) => sprite.pokemon)
  sprites: PokemonSprite[]

  @ManyToMany(() => PokemonAbility, (ability: PokemonAbility) => ability.pokemons)
  @JoinTable()
  abilities: PokemonAbility[]

  @ManyToMany(() => PokemonType, (pokemonType: PokemonType) => pokemonType.pokemons)
  @JoinTable()
  types: PokemonType[]

  @ManyToMany(() => PokemonMove, (move: PokemonMove) => move.pokemons)
  @JoinTable()
  moves: PokemonMove[]
}
