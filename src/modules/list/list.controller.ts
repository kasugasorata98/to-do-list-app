import { UpdateWriteOpResult } from 'mongoose'
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
