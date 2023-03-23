import { UpdateWriteOpResult } from 'mongoose'
import userModel, { User } from '../../database/model/user.model'

class ListService {
  async addToList({
    username,
    title,
  }: {
    username: string
    title: string
  }): Promise<UpdateWriteOpResult> {
    return userModel.updateOne(
      { username },
      {
        $push: {
          toDoList: {
            title,
          },
        },
      }
    )
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
