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
  }) {
    this.listService.addToList({ username, title, description })
  }
}

export default ListController
