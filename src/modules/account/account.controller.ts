import AccountService from './account.service'
import jwtDecode from 'jwt-decode'
import { User } from '../../database/model/user.model'

class AccountController {
  private accountService: AccountService
  constructor() {
    this.accountService = new AccountService()
  }
  registerUser(idToken: string): Promise<User | null> {
    const {
      email,
      sub,
      'cognito:username': username,
    }: { [key: string]: string } = jwtDecode(idToken)
    return this.accountService.createUser({
      email,
      sub,
      username,
    })
  }
  async getUser(userId: string): Promise<User | null> {
    return this.accountService.getUser(userId)
  }
}

export default AccountController
