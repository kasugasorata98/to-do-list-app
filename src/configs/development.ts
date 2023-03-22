import { Config } from './index'

const development = (): Config => {
  return {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '',
    mongoDBString: process.env.MONGODB_CONNECTION_STRING || '',
    region: process.env.REGION || '',
  }
}

export default development
