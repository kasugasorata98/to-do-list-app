import userModel, { User } from '../../database/model/user.model'
class AccountService {
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
}

export default AccountService
