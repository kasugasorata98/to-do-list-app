import AccountService from './account.service'
import jwtDecode from 'jwt-decode'
import { User } from '../../database/model/user.model'
class AccountController {
  private accountService: AccountService
  constructor() {
    this.accountService = new AccountService()
  }
  async registerUser(idToken: string) {
    const {
      email,
      sub,
      name,
      'cognito:username': username,
    }: { [key: string]: string } = jwtDecode(idToken)
    return this.accountService.createUser({
      email,
      sub,
      name,
      username,
    })
  }
  async getUser(userId: string): Promise<User | null> {
    return this.accountService.getUser(userId)
  }
  refreshToken(refreshToken: string) {
    return this.accountService.refreshToken(refreshToken)
  }
}

export default AccountController