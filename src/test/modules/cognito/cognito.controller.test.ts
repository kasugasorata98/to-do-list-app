import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import CognitoController from '../../../modules/cognito/cognito.controller'
import CognitoService from '../../../modules/cognito/cognito.service'
import { config } from '../../../configs'

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('CognitoController', () => {
  let cognitoController: CognitoController
  let mockAuthorize: jest.SpyInstance
  let mockRefreshToken: jest.SpyInstance
  beforeAll(() => {
    cognitoController = new CognitoController()

    mockAuthorize = jest.spyOn(CognitoService.prototype, 'authorize')
    mockAuthorize.mockImplementation(async () => {
      return {
        accessToken: 'access_token',
        expiresIn: 3600,
        refreshToken: 'refresh_token',
        tokenType: 'Bearer',
      }
    })
    mockRefreshToken = jest.spyOn(CognitoService.prototype, 'refreshToken')
    mockRefreshToken.mockImplementation(async () => {
      return {
        accessToken: 'access_token',
        expiresIn: 3600,
        refreshToken: 'refresh_token',
        tokenType: 'Bearer',
      }
    })
  })
  afterEach(() => {
    mockAuthorize.mockClear()
    mockRefreshToken.mockClear()
  })
  describe('getAuthorizationLink', () => {
    it('should return the authorization link', () => {
      const link = cognitoController.getAuthorizationLink(
        'http://localhost:3000/callback'
      )

      expect(link).toBe(
        `https://to-do-list.auth.ap-southeast-1.amazoncognito.com/oauth2/authorize?identity_provider=Google&redirect_uri=http://localhost:3000/callback&response_type=CODE&client_id=${config.cognitoClientId}&scope=openid+email+profile+aws.cognito.signin.user.admin`
      )
    })
  })
  describe('authorize', () => {
    it('should authorize the user and return the token', async () => {
      const token = await cognitoController.authorize(
        'authorization_code',
        'http://localhost:3000/callback'
      )

      expect(token).toMatchObject({
        accessToken: 'access_token',
        expiresIn: 3600,
        refreshToken: 'refresh_token',
        tokenType: 'Bearer',
      })

      expect(mockAuthorize).toHaveBeenCalledWith(
        'authorization_code',
        'http://localhost:3000/callback'
      )
    })
  })
  describe('refreshToken', () => {
    it('should refresh the access token and return the new token', async () => {
      const token = await cognitoController.refreshToken('refresh_token')

      expect(token).toMatchObject({
        accessToken: 'access_token',
        expiresIn: 3600,
        refreshToken: 'refresh_token',
        tokenType: 'Bearer',
      })
      expect(mockRefreshToken).toHaveBeenCalledWith('refresh_token')
    })
  })
})
