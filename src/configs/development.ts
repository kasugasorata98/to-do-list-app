import { Config } from './index'

const development = (): Config => {
  return {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '',
    mongoDBString: process.env.MONGODB_CONNECTION_STRING || '',
    region: process.env.REGION || '',
    cognitoDomain: process.env.COGNITO_DOMAIN || '',
    cognitoClientId: process.env.COGNITO_CLIENT_ID || '',
    cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID || '',
  }
}

export default development
