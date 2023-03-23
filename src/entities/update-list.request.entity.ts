import { JwtPayload } from './jwtpayload.entity'

export interface UpdateListRequest {
  title: string
  isDone: boolean
  toDoListId: string
  jwtPayload: JwtPayload
}
