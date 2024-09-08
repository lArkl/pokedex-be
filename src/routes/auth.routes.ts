import { Router } from 'express'
import envConfig from '../envConfig'
import { clearSession, createTokensInfo, refreshSession } from '../controllers/session.controller'
import { RefreshTokenError } from '../utils/errors'
import { signUserSchema, zParse } from '../validators'
import { getValidUserIdByCredentials } from '../controllers/user.controller'

const router = Router()

router.post('/signin', async (req, res, next) => {
  try {
    const { body } = await zParse(signUserSchema, req)
    const userId = await getValidUserIdByCredentials(body)

    const { accessToken, refreshToken } = await createTokensInfo({ id: userId })

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure it's secure in production
      sameSite: 'strict', // Protect against CSRF
      maxAge: envConfig.ACCESS_TOKEN_EXPIRATION * 1000,
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: envConfig.REFRESH_TOKEN_EXPIRATION * 1000,
    })
    res.json({
      data: { message: 'sign in successfully' },
    })
  } catch (err) {
    next(err)
  }
})

router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) {
      throw new RefreshTokenError('Refresh token not found')
    }
    const sessionInfo = await refreshSession(refreshToken)
    res.cookie('accessToken', sessionInfo.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure it's secure in production
      sameSite: 'strict', // Protect against CSRF
      maxAge: envConfig.ACCESS_TOKEN_EXPIRATION * 1000,
    })

    res.json({
      data: { expiration: sessionInfo.expiration },
    })
  } catch (err) {
    next(err)
  }
})

router.post('/logout', async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) {
      console.error('No refresh token')
      await clearSession(refreshToken)
    }
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.json({
      data: { message: 'logged out' },
    })
  } catch (err) {
    next(err)
  }
})

export default router
