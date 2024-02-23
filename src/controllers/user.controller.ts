import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import { createUser, getUserByEmail, getUserById } from '../repositories/user.repository'
import { config } from 'dotenv'
config()

const secret = process.env.EXPRESS_SECRET ?? 'secret'

export const createJWT = (id: number): string => {
  return jsonwebtoken.sign({ id }, secret)
}

const saltRounds = 12
export const signUpUser = async (params: { firstname: string; lastname: string; password: string; email: string }) => {
  const user = await getUserByEmail(params.email)
  if (user) {
    throw Error(`User with email ${params.email} already exists`)
  }
  const password = await bcrypt.hash(params.password, saltRounds)
  const newUser = await createUser({ ...params, password })

  return {
    firstname: newUser.firstname,
    lastname: newUser.lastname,
    id: newUser.id,
    updatedAt: newUser.updatedAt,
  }
}

export const signInUser = async (params: { password: string; email: string }) => {
  const user = await getUserByEmail(params.email)
  if (!user) {
    throw Error('Wrong credentials')
  }
  const success = await bcrypt.compare(params.password, user.password)
  if (success) {
    const token = createJWT(user.id)
    return {
      firstname: user.firstname,
      lastname: user.lastname,
      id: user.id,
      updatedAt: user.updatedAt,
      token,
    }
  }
  throw Error('Wrong credentials')
}

export const validateUser = async (token: string) => {
  try {
    const data = jsonwebtoken.verify(token, secret) as { id: number }
    const user = await getUserById(data.id)
    if (!user) {
      throw Error
    }
    return {
      firstname: user.firstname,
      lastname: user.lastname,
      id: user.id,
      updatedAt: user.updatedAt,
      token,
    }
  } catch (err) {
    throw Error('Invalid token')
  }
}
