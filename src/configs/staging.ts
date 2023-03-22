import { Config } from './index'

const staging = (): Config => {
  return {
    environment: process.env.NODE_ENV || 'staging',
    mongoDBString: process.env.MONGODB_CONNECTION_STRING || '',
    port: process.env.PORT || '',
    region: process.env.REGION || '',
    cognitoDomain: process.env.COGNITO_DOMAIN || '',
    cognitoClientId: process.env.COGNITO_CLIENT_ID || '',
    cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID || '',
  }
}

export default staging
