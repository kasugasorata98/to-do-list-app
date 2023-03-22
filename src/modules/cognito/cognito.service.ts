import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import axios from 'axios'
import { config } from '../../configs'
import { Constants } from '../../constants'
import { Token } from '../../entities/token.entity'

class CognitoService {
  private client: CognitoIdentityProviderClient
  constructor() {
    this.client = new CognitoIdentityProviderClient({
      region: config.region,
    })
  }
  async authorize(authorizationCode: string, callback: string): Promise<Token> {
    const query = new URLSearchParams({
      grant_type: 'authorization_code',
      code: authorizationCode,
      client_id: config.cognitoClientId,
      redirect_uri: callback,
    })
    const { data } = await axios.post(
      'https://to-do-list.auth.ap-southeast-1.amazoncognito.com/oauth2/token',
      query.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    return data
  }
  async refreshToken(refreshToken: string) {
    const request = new InitiateAuthCommand({
      AuthFlow: Constants.AUTH_FLOWS.REFRESH_TOKEN_AUTH,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
      ClientId: process.env.COGNITO_CLIENT_ID as string,
    })
    const response = await this.client.send(request)

    return {
      access_token: response?.AuthenticationResult?.AccessToken,
      refresh_token: response?.AuthenticationResult?.RefreshToken,
      id_token: response?.AuthenticationResult?.IdToken,
      token_type: response?.AuthenticationResult?.TokenType,
      expires_in: response?.AuthenticationResult?.ExpiresIn,
    }
  }
}

export default CognitoService
