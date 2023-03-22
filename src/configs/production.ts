import { Config } from './index'

const production = (): Config => {
  return {
    environment: process.env.NODE_ENV || 'production',
    mongoDBString: process.env.MONGODB_CONNECTION_STRING || '',
    port: process.env.PORT || '',
  }
}

export default production
