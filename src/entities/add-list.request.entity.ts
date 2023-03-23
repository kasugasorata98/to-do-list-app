import { JwtPayload } from './jwtpayload.entity'

export interface AddListRequest {
  title: string
  jwtPayload: JwtPayload
}
