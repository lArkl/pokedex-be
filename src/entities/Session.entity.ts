import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  refreshToken: string

  @CreateDateColumn()
  createdAt: Date
}
