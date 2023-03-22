import { Token } from '../../entities/token.entity'
import CognitoService from './cognito.service'
class CognitoController {
  private cognitoService: CognitoService

  constructor() {
    this.cognitoService = new CognitoService()
  }

  getAuthorizationLink() {
    return `https://car-listing-marketplace.auth.ap-southeast-1.amazoncognito.com/oauth2/authorize?identity_provider=Google&redirect_uri=${
      process.env.REDIRECT_URI as string
    }&response_type=CODE&client_id=${
      process.env.COGNITO_CLIENT_ID as string
    }&scope=openid+email+profile+aws.cognito.signin.user.admin`
  }

  async authorize(authorizationCode: string): Promise<Token> {
    return this.cognitoService.authorize(authorizationCode)
  }
}

export default CognitoController
