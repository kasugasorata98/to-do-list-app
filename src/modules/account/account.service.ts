import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { Constants } from '../../constants'
import userModel, { User } from '../../database/model/user.model'
class AccountService {
  private client: CognitoIdentityProviderClient
  constructor() {
    this.client = new CognitoIdentityProviderClient({
      region: 'ap-southeast-1',
    })
  }
  createUser({ name, sub, email, username }: { [key: string]: string }) {
    return userModel.findOneAndUpdate(
      {
        email,
      },
      { name, sub, email, username },
      { upsert: true }
    )
  }
  getUser(userId: string): Promise<User | null> {
    return userModel.findById(userId)
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

export default AccountService
