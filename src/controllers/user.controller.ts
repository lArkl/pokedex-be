import bcrypt from 'bcrypt'
import envConfig from '../envConfig'
import { createUser, getUserByEmail, getUserById, updateUser } from '../repositories/user.repository'
import { AuthUserError } from '../utils/errors'

export const signUpUser = async (params: { firstname: string; lastname: string; password: string; email: string }) => {
  const user = await getUserByEmail(params.email)
  if (user) {
    throw new AuthUserError(`User already exists`)
  }
  const password = await bcrypt.hash(params.password, envConfig.SALT_ROUNDS)
  const newUser = await createUser({ ...params, password })

  return {
    firstname: newUser.firstname,
    lastname: newUser.lastname,
    id: newUser.id,
    updatedAt: newUser.updatedAt,
  }
}

export const getValidUserIdByCredentials = async (params: { password: string; email: string }) => {
  const user = await getUserByEmail(params.email)
  if (!user) {
    throw new AuthUserError('No user with that email exists')
  }
  const success = await bcrypt.compare(params.password, user.password)

  if (!success) {
    throw new AuthUserError('Wrong credentials')
  }
  return user.id
}

export const getUserInfoById = async (userId: number) => {
  const user = await getUserById(userId)
  if (!user) {
    throw new AuthUserError('No user found')
  }
  const { firstname, lastname, email } = user
  return { firstname, lastname, email }
}

export const updateUserProfile = async (
  userId: number,
  fields: Partial<{ firstname: string; lastname: string; email: string }>,
) => {
  const user = await getUserById(userId)
  if (!user) {
    throw new AuthUserError('No user found')
  }
  const updatedFields = {
    firstname: fields.firstname ?? user.firstname,
    lastname: fields.lastname ?? user.lastname,
    email: fields.email ?? user.email,
  }
  return updateUser(user, updatedFields)
}
