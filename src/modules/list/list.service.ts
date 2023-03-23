import { Types, UpdateWriteOpResult } from 'mongoose'
import userModel, { User } from '../../database/model/user.model'

class ListService {
  async addToList({
    username,
    title,
  }: {
    username: string
    title: string
  }): Promise<User['toDoList'] | undefined> {
    const _id = new Types.ObjectId()
    await userModel.updateOne(
      { username },
      {
        $push: {
          toDoList: {
            _id,
            title,
          },
        },
      }
    )
    const user = await userModel.findOne(
      {
        username,
        toDoList: { $elemMatch: { _id } },
      },
      { 'toDoList.$': 1 }
    )
    return user?.toDoList
  }

  getList({ username }: { username: string }): Promise<User | null> {
    return userModel.findOne({ username }).select('toDoList -_id')
  }

  updateList({
    username,
    toDoListId,
    title,
    isDone,
  }: {
    username: string
    toDoListId: string
    title: string
    isDone: boolean
  }): Promise<UpdateWriteOpResult> {
    return userModel.updateOne(
      { username, 'toDoList._id': toDoListId },
      {
        $set: {
          'toDoList.$[elem].isDone': isDone,
          'toDoList.$[elem].title': title,
        },
      },
      { arrayFilters: [{ 'elem._id': toDoListId }] }
    )
  }
  deleteList({
    username,
    toDoListId,
  }: {
    username: string
    toDoListId: string
  }): Promise<UpdateWriteOpResult> {
    return userModel.updateOne(
      { username },
      { $pull: { toDoList: { _id: toDoListId } } }
    )
  }

  deleteAll({ username }: { username: string }): Promise<UpdateWriteOpResult> {
    return userModel.updateOne({ username }, { $set: { toDoList: [] } })
  }
}

export default ListService
