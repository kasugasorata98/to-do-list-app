import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import axios from 'axios'
import { config } from '../../configs'
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
}

export default CognitoService
