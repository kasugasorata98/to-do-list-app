import { JwtPayload } from './jwtpayload.entity'

export interface DeleteListRequest {
  flag: 'DELETE_ALL' | 'DELETE_ONE'
  toDoListId: string
  jwtPayload: JwtPayload
}
