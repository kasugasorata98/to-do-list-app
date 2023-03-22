import { JwtPayload } from './jwtpayload.entity'

export interface AddListRequest {
  title: string
  description: string
  jwtPayload: JwtPayload
}
