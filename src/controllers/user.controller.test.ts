import { describe, it, afterEach, vi, expect, Mock } from 'vitest'
import { getValidUserIdByCredentials, signUpUser, getUserInfoById, updateUserProfile } from './user.controller'
import * as userRepository from '../repositories/user.repository'
import bcrypt from 'bcrypt'

vi.mock('../repositories/user.repository')
vi.mock('jsonwebtoken')
vi.mock('bcrypt')

describe('User controller', () => {
  const mockCreateUser = userRepository.createUser as Mock
  const mockBcryptCompare = bcrypt.compare as Mock
  const mockBcryptHash = bcrypt.hash as Mock
  const mockGetUserById = userRepository.getUserById as Mock
  const mockUpdateUser = userRepository.updateUser as Mock
  const mockGetUserByEmail = userRepository.getUserByEmail as Mock

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getUserInfoById', () => {
    const userId = 1
    it('returns user info from id', async () => {
      const mockedUser = { firstname: 'user1', lastname: 'last', email: 'a@test.com' }

      mockGetUserById.mockReturnValue(mockedUser)
      const token = await getUserInfoById(userId)

      expect(token).toEqual(mockedUser)
    })

    it('throws error if user is not found', async () => {
      mockGetUserById.mockReturnValue(null)
      expect(async () => getUserInfoById(userId)).rejects.toThrow()
    })
  })

  describe('getValidUserIdByCredentials', () => {
    const mockedUser = { id: 1, password: 'q' }
    const mockUserCredentials = { email: 'a@test.com', password: 'password' }

    it('returns userId from valid credentials', async () => {
      mockGetUserByEmail.mockReturnValue(mockedUser)
      mockBcryptCompare.mockReturnValue(true)

      const userId = await getValidUserIdByCredentials(mockUserCredentials)
      expect(userId).toBe(mockedUser.id)
    })

    it('throws error if user is not found', async () => {
      mockGetUserByEmail.mockReturnValue(null)

      expect(() => getValidUserIdByCredentials(mockUserCredentials)).rejects.toThrow()
    })

    it('throws error if user password does not match', async () => {
      mockGetUserByEmail.mockReturnValue(mockedUser)
      mockBcryptCompare.mockReturnValue(false)

      expect(() => getValidUserIdByCredentials(mockUserCredentials)).rejects.toThrow()
    })
  })

  describe('signUpUser', () => {
    const mockParams = { firstname: 'first', lastname: 'last', email: 'a@test.com', password: 'password' }

    it('returns user data', async () => {
      const newUser = {
        firstname: mockParams.firstname,
        lastname: mockParams.lastname,
        id: 1,
        updatedAt: new Date().toISOString(),
      }
      mockGetUserByEmail.mockReturnValue(null)
      mockBcryptHash.mockReturnValue('hash')
      mockCreateUser.mockReturnValue(newUser)

      const user = await signUpUser(mockParams)
      expect(user).toEqual(newUser)
    })

    it('throws error if user already exists', async () => {
      mockGetUserByEmail.mockReturnValue({
        firstname: mockParams.firstname,
        lastname: mockParams.lastname,
        id: 1,
        updatedAt: new Date().toISOString(),
      })

      expect(() => signUpUser(mockParams)).rejects.toThrow()
    })
  })

  describe('updateUserProfile', () => {
    const userMock = { email: 'test@test.com', firstname: 'test1', lastname: 'last', password: 'pasword' }
    const userId = 1
    it('returns updated user data', async () => {
      mockGetUserById.mockReturnValue(userMock)
      mockUpdateUser.mockReturnValue({
        ...userMock,
        firstname: 'test2',
      })

      const user = await updateUserProfile(userId, { firstname: 'test2' })
      expect(user).toEqual({
        ...userMock,
        firstname: 'test2',
      })
    })

    it('throws error if user not found', async () => {
      mockGetUserById.mockReturnValue(null)

      expect(() => updateUserProfile(userId, { firstname: 'test2' })).rejects.toThrow()
    })

    it('throws error if updating fails', async () => {
      mockGetUserById.mockReturnValue(userMock)
      mockUpdateUser.mockRejectedValue(Error)

      expect(() => updateUserProfile(userId, { firstname: 'test2' })).rejects.toThrow()
    })
  })
})
