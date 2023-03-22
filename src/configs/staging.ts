import { Config } from './index'

const staging = (): Config => {
  return {
    environment: process.env.NODE_ENV || 'staging',
    mongoDBString: process.env.MONGODB_CONNECTION_STRING || '',
    port: process.env.PORT || '',
    region: process.env.REGION || '',
  }
}

export default staging
