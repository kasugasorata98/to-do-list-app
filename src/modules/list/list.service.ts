import { UpdateWriteOpResult } from 'mongoose'
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
  }): Promise<UpdateWriteOpResult> {
    return userModel.updateOne(
      { username },
      {
        $push: {
          toDoList: {
            title,
            description,
          },
        },
      }
    )
  }
  updateList({
    username,
    toDoListId,
    title,
    description,
    isDone,
  }: {
    username: string
    toDoListId: string
    title: string
    description: string
    isDone: boolean
  }): Promise<UpdateWriteOpResult> {
    return userModel.updateOne(
      { username, 'toDoList._id': toDoListId },
      {
        $set: {
          'toDoList.$[elem].isDone': isDone,
          'toDoList.$[elem].title': title,
          'toDoList.$[elem].description': description,
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
