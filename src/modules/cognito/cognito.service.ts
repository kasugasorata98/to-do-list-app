import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import axios from 'axios'
import { Token } from '../../entity/token.entity'

class CognitoService {
  private client: CognitoIdentityProviderClient
  constructor() {
    this.client = new CognitoIdentityProviderClient({
      region: 'ap-southeast-1',
    })
  }
  async authorize(authorizationCode: string): Promise<Token> {
    const query = new URLSearchParams({
      grant_type: 'authorization_code',
      code: authorizationCode,
      client_id: process.env.COGNITO_CLIENT_ID as string,
      redirect_uri: process.env.REDIRECT_URI as string,
    })
    const { data } = await axios.post(
      'https://car-listing-marketplace.auth.ap-southeast-1.amazoncognito.com/oauth2/token',
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
