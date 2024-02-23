import { AppDataSource } from '../db'
import { User } from '../entities/User.entity'

export const getUserByEmail = async (email: string) => {
  return AppDataSource.getRepository(User).findOneBy({ email })
}

export const getUserById = async (id: number) => {
  return AppDataSource.getRepository(User).findOneBy({ id })
}

export const createUser = async (baseUser: {
  firstname: string
  email: string
  password: string
  lastname: string
}) => {
  const user = new User()
  user.firstname = baseUser.firstname
  user.lastname = baseUser.lastname
  user.email = baseUser.email
  user.password = baseUser.password
  return AppDataSource.manager.save(user)
}

// export const updateUser = async (baseUser: {
//   firstname: string
//   email: string
//   password: string
//   lastname: string
// }) => {
//   return AppDataSource.manager.update(User, 1, { email })
// }
