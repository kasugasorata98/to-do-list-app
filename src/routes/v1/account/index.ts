import express, { Request, Response } from 'express'
import { Token } from '../../../entities/token.entity'
import AccountController from '../../../modules/account/account.controller'
import CognitoController from '../../../modules/cognito/cognito.controller'

const router = express.Router()
const cognitoController = new CognitoController()
const accountController = new AccountController()

router.post('/authorize', async (req: Request, res: Response) => {
  const { code } = req.body
  try {
    const response: Token = await cognitoController.authorize(code as string)
    await accountController.registerUser(response.id_token)
    res.json(response)
  } catch (err: any) {
    res.status(500).json({
      message: err?.response?.data,
    })
  }
})

router.get('/getAuthLink', (req: Request, res: Response) => {
  res.json({
    authorizeLink: cognitoController.getAuthorizationLink(),
  })
})

export default router
