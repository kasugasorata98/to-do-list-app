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
  }: {
    username: string
    title: string
  }): Promise<User['toDoList'] | undefined> {
    return this.listService.addToList({ username, title })
  }

  getList({ username }: { username: string }): Promise<User | null> {
    return this.listService.getList({ username })
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
    return this.listService.updateList({
      username,
      toDoListId,
      title,
      isDone,
    })
  }

  deleteList({
    username,
    toDoListId,
    flag,
  }: {
    username: string
    toDoListId: string
    flag: 'DELETE_ALL' | 'DELETE_ONE'
  }): Promise<UpdateWriteOpResult> {
    switch (flag) {
      case 'DELETE_ALL': {
        return this.listService.deleteAll({
          username,
        })
      }
      case 'DELETE_ONE': {
        return this.listService.deleteList({
          username,
          toDoListId,
        })
      }
    }
  }
}

export default ListController
