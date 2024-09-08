import { RequestHandler } from 'express'
import { parseAccessToken } from '../controllers/session.controller'
import { AuthTokenError, RefreshTokenError } from '../utils/errors'

export const accessTokenMiddleware: RequestHandler = (req, _, next) => {
  const refreshToken = req.cookies?.refreshToken
  if (!refreshToken) {
    return next(new RefreshTokenError('Refresh token not found'))
  }

  const accessToken = req.cookies?.accessToken
  if (!accessToken) {
    return next(new AuthTokenError('Authentication token not found'))
  }

  const tokenInfo = parseAccessToken(accessToken)

  req.userId = tokenInfo.id
  req.expiration = tokenInfo.expiration

  next()
}
