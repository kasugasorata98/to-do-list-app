import userModel, { User } from '../../database/model/user.model'
class AccountService {
  createUser({ sub, email, username }: { [key: string]: string }) {
    return userModel.findOneAndUpdate(
      {
        email,
      },
      { sub, email, username },
      { upsert: true }
    )
  }
  getUser(userId: string): Promise<User | null> {
    return userModel.findById(userId)
  }
}

export default AccountService
