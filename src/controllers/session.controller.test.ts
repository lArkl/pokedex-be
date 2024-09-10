import { describe, it, afterEach, vi, expect, Mock, afterAll } from 'vitest'
import { createTokensInfo, parseAccessToken, refreshSession } from './session.controller'
import * as sessionRepository from '../repositories/session.repository'
import * as userRepository from '../repositories/user.repository'
import jsonwebtoken from 'jsonwebtoken'

vi.mock('../repositories/session.repository')
vi.mock('../repositories/user.repository')
vi.mock('jsonwebtoken')

describe('Session controller', () => {
  const refreshToken = 'mockRefreshToken'
  const mockGetBlacklistedToken = sessionRepository.tokenIsBlacklisted as Mock
  const mockGetUserById = userRepository.getUserById as Mock
  const mockJwtVerify = jsonwebtoken.verify as Mock
  const mockJwtSign = jsonwebtoken.sign as Mock

  afterEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  describe('refreshSession', () => {
    const expirationMock = '2024-08-29T15:59:07.582Z'
    it('should return a new access token with a valid refresh token', async () => {
      const expectedToken = 'newaccesstoken'
      mockGetBlacklistedToken.mockReturnValue(null)
      mockJwtVerify.mockReturnValue({ id: 1, expiration: expirationMock })
      mockJwtSign.mockReturnValue(expectedToken)
      const token = await refreshSession(refreshToken)

      expect(mockGetBlacklistedToken).toHaveBeenCalledWith(refreshToken)
      expect(token).toEqual({
        accessToken: expectedToken,
        expiration: expirationMock,
      })
    })

    it('throws error if session is blacklisted', async () => {
      mockGetBlacklistedToken.mockReturnValue({})
      expect(async () => refreshSession(refreshToken)).rejects.toThrow()
    })

    it('throws error if verification fails', async () => {
      mockGetBlacklistedToken.mockReturnValue('session')
      mockJwtVerify.mockImplementation(() => {
        throw Error
      })
      expect(async () => refreshSession(refreshToken)).rejects.toThrow()
    })

    it('throws error if no user found', async () => {
      mockGetBlacklistedToken.mockReturnValue('session')
      mockJwtVerify.mockReturnValue({ id: 1 })
      mockGetUserById.mockReturnValue(null)

      expect(async () => refreshSession(refreshToken)).rejects.toThrow()
    })
  })

  describe('createTokensInfo', () => {
    it('returns session tokens', async () => {
      const expectedToken = 'expectedtoken'
      mockJwtSign.mockReturnValue(expectedToken)

      const tokenInfo = await createTokensInfo({ id: 1 })
      expect(tokenInfo).toEqual({
        accessToken: 'expectedtoken',
        refreshToken: 'expectedtoken',
      })
    })
  })

  describe('parseAccessToken', () => {
    it('returns user data', async () => {
      const expectedPayload = {
        id: 1,
        expiration: '1',
      }
      mockJwtVerify.mockReturnValue(expectedPayload)

      const token = 'something'
      const user = parseAccessToken(token)

      expect(user).toEqual(expectedPayload)
    })

    it('throws error if verification fails', async () => {
      const token = 'something'
      mockJwtVerify.mockImplementation(() => {
        throw Error
      })
      expect(() => parseAccessToken(token)).toThrow()
    })
  })
})
