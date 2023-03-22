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
  }): Promise<User | null> {
    return this.listService.addToList({ username, title, description })
  }
}

export default ListController
