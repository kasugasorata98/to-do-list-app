import axios from 'axios'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import CognitoService from '../../../modules/cognito/cognito.service'

jest.mock('axios')

describe('CognitoService', () => {
  let cognitoService: CognitoService
  let mockAxiosPost: jest.MockedFunction<typeof axios.post>
  let mockCognitoIdentityProviderClient: jest.Mocked<CognitoIdentityProviderClient>

  beforeEach(() => {
    cognitoService = new CognitoService()
    mockAxiosPost = jest.mocked(axios.post)
    mockCognitoIdentityProviderClient = new CognitoIdentityProviderClient({
      region: 'ap-southeast-1',
    }) as jest.Mocked<CognitoIdentityProviderClient>
  })

  describe('authorize', () => {
    it('should exchange authorization code for access token and refresh token', async () => {
      const mockResponse = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
        id_token: 'id_token',
        token_type: 'Bearer',
        expires_in: 3600,
      }
      mockAxiosPost.mockResolvedValueOnce({ data: mockResponse })

      const mockAuthorizationCode = 'mock_authorization_code'
      const mockCallback = 'http://localhost:3000/callback'
      const actualResult = await cognitoService.authorize(
        mockAuthorizationCode,
        mockCallback
      )

      expect(actualResult).toEqual(mockResponse)
    })

    it('should throw an error when the axios.post request fails', async () => {
      const mockError = new Error('Mock error')
      mockAxiosPost.mockRejectedValueOnce(mockError)

      const mockAuthorizationCode = 'mock_authorization_code'
      const mockCallback = 'http://localhost:3000/callback'
      const authorizePromise = cognitoService.authorize(
        mockAuthorizationCode,
        mockCallback
      )

      await expect(authorizePromise).rejects.toThrowError(mockError)
    })
  })
})
