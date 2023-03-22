import { JwtPayload } from './jwtpayload.entity'

export interface UpdateListRequest {
  title: string
  description: string
  isDone: boolean
  toDoListId: string
  jwtPayload: JwtPayload
}
