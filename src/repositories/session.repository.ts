import { AppDataSource } from '../db'
import { Session } from '../entities/Session.entity'

export const tokenIsBlacklisted = async (refreshToken: string) => {
  return AppDataSource.getRepository(Session).findOneBy({ refreshToken })
}

export const addToBlackList = async (refreshToken: string) => {
  const session = new Session()
  session.refreshToken = refreshToken
  return AppDataSource.manager.save(session)
}
