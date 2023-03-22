import AccountService from './account.service'
import jwtDecode from 'jwt-decode'
class AccountController {
  private accountService: AccountService
  constructor() {
    this.accountService = new AccountService()
  }
  //   async registerUser(idToken: string) {
  //     const {
  //       email,
  //       sub,
  //       name,
  //       'cognito:username': username,
  //     }: { [key: string]: string } = jwtDecode(idToken)
  //     return this.userService.createUser({
  //       email,
  //       sub,
  //       name,
  //       username,
  //     })
  //   }
  //   async getUser(userId: string): Promise<User | null> {
  //     return this.userService.getUser(userId)
  //   }
  //   refreshToken(refreshToken: string) {
  //     return this.userService.refreshToken(refreshToken)
  //   }
}

export default AccountController
