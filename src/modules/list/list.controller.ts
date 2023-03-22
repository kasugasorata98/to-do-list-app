import { UpdateWriteOpResult } from 'mongoose'
import { User } from '../../database/model/user.model'
import ListService from './list.service'

class ListController {
  private listService: ListService
  constructor() {
    this.listService = new ListService()
  }
  addToList({
    username,
    title,
    description,
  }: {
    username: string
    title: string
    description: string
  }): Promise<UpdateWriteOpResult> {
    return this.listService.addToList({ username, title, description })
  }

  getList({ username }: { username: string }): Promise<User | null> {
    return this.listService.getList({ username })
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
    return this.listService.updateList({
      username,
      toDoListId,
      title,
      description,
      isDone,
    })
  }

  deleteList({
    username,
    toDoListId,
  }: {
    username: string
    toDoListId: string
  }): Promise<UpdateWriteOpResult> {
    return this.listService.deleteList({
      username,
      toDoListId,
    })
  }

  deleteAll({ username }: { username: string }): Promise<UpdateWriteOpResult> {
    return this.listService.deleteAll({
      username,
    })
  }
}

export default ListController
