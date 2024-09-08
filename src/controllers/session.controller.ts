import jsonwebtoken from 'jsonwebtoken'
import envConfig from '../envConfig'
import { addToBlackList, tokenIsBlacklisted } from '../repositories/session.repository'
import { AuthTokenError, RefreshTokenError } from '../utils/errors'

const getExpirationIso = (expirationSeconds: number) => new Date(Date.now() + expirationSeconds * 1000).toISOString()

export const generateAccessToken = (params: { id: number; expiration: string }) => {
  return jsonwebtoken.sign({ id: params.id, expiration: params.expiration }, envConfig.ACCESS_TOKEN_PRIVATE_KEY, {
    expiresIn: envConfig.ACCESS_TOKEN_EXPIRATION,
  })
}

export const generateRefreshToken = (params: { id: number; expiration: string }) => {
  return jsonwebtoken.sign({ id: params.id, expiration: params.expiration }, envConfig.REFRESH_TOKEN_PRIVATE_KEY, {
    expiresIn: envConfig.REFRESH_TOKEN_EXPIRATION,
  })
}

export const createTokensInfo = async (params: { id: number }) => {
  const expiration = getExpirationIso(envConfig.REFRESH_TOKEN_EXPIRATION)
  const newParams = { ...params, expiration }
  const accessToken = generateAccessToken(newParams)
  const refreshToken = generateRefreshToken(newParams)
  return {
    accessToken,
    refreshToken,
  }
}

export const parseAccessToken = (token: string) => {
  try {
    return jsonwebtoken.verify(token, envConfig.ACCESS_TOKEN_PUBLIC_KEY) as { id: number; expiration: string }
  } catch (err) {
    console.error(err)
    throw new AuthTokenError('Invalid Access token')
  }
}

export const refreshSession = async (refreshToken: string) => {
  const session = await tokenIsBlacklisted(refreshToken)
  if (session) {
    throw new RefreshTokenError('Refresh token is not valid')
  }

  const payload = jsonwebtoken.verify(refreshToken, envConfig.REFRESH_TOKEN_PUBLIC_KEY) as {
    id: number
    expiration: string
  }
  if (!payload) {
    throw new RefreshTokenError('Refresh token could not be verified')
  }

  return {
    accessToken: generateAccessToken({ id: payload.id, expiration: payload.expiration }),
    expiration: payload.expiration,
  }
}

export const clearSession = async (refreshToken: string): Promise<void> => {
  await addToBlackList(refreshToken)
}
