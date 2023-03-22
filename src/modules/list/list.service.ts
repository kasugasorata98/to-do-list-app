import userModel from '../../database/model/user.model'

class ListService {
  async addToList({
    username,
    title,
    description,
  }: {
    username: string
    title: string
    description: string
  }) {
    const user = await userModel.findOne({
      username,
    })
    user?.toDoList.push({
      title,
      description,
    })
  }
}

export default ListService
