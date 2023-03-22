import userModel, { User } from '../../database/model/user.model'

class ListService {
  async addToList({
    username,
    title,
    description,
  }: {
    username: string
    title: string
    description: string
  }): Promise<User | null> {
    const user = await userModel.findOne({
      username,
    })
    user?.toDoList.push({
      title,
      description,
    })
    await user?.save()
    return user
  }
}

export default ListService
