import express, { Request, Response } from 'express'
import { Token } from '../../../entities/token.entity'
import AccountController from '../../../modules/account/account.controller'
import CognitoController from '../../../modules/cognito/cognito.controller'
import { body, query, validationResult } from 'express-validator'
import { Constants } from '../../../constants'

const router = express.Router()
const cognitoController = new CognitoController()
const accountController = new AccountController()

router.post(
  '/authorize',
  [
    body('code').isString().withMessage(Constants.ERROR_MESSAGES.CODE_REQUIRED),
    body('callback')
      .isString()
      .withMessage(Constants.ERROR_MESSAGES.CALLBACK_REQUIRED),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(Constants.HTTP_CODES.BAD_REQUEST)
        .json({ errors: errors.array() })
    }
    const { code, callback } = req.body
    try {
      const response: Token = await cognitoController.authorize(
        code as string,
        callback as string
      )
      await accountController.registerUser(response.id_token)
      res.json(response)
    } catch (err: any) {
      res.status(500).json({
        message: err?.response?.data,
      })
    }
  }
)

router.get(
  '/getAuthLink/',
  [
    query('callback')
      .isString()
      .withMessage(Constants.ERROR_MESSAGES.CALLBACK_REQUIRED),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(Constants.HTTP_CODES.BAD_REQUEST)
        .json({ errors: errors.array() })
    }
    const { callback } = req.query
    res.json({
      authorizeLink: cognitoController.getAuthorizationLink(callback as string),
    })
  }
)

router.post(
  '/refreshToken',
  [
    body('refreshToken')
      .isString()
      .withMessage(Constants.ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED),
  ],
  async (req: Request, res: Response) => {
    try {
      const tokens = await accountController.refreshToken(req.body.refreshToken)
      return res.json(tokens)
    } catch (err: any) {
      res.status(500).json({
        message: err?.message,
        code: err?.code,
      })
    }
  }
)

export default router
