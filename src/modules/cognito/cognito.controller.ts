import { config } from '../../configs'
import { Token } from '../../entities/token.entity'
import CognitoService from './cognito.service'
class CognitoController {
  private cognitoService: CognitoService

  constructor() {
    this.cognitoService = new CognitoService()
  }

  getAuthorizationLink(callback: string) {
    return `https://to-do-list.auth.ap-southeast-1.amazoncognito.com/oauth2/authorize?identity_provider=Google&redirect_uri=${callback}&response_type=CODE&client_id=${config.cognitoClientId}&scope=openid+email+profile+aws.cognito.signin.user.admin`
  }

  async authorize(authorizationCode: string, callback: string): Promise<Token> {
    return this.cognitoService.authorize(authorizationCode, callback)
  }

  refreshToken(refreshToken: string) {
    return this.cognitoService.refreshToken(refreshToken)
  }
}

export default CognitoController
