import express, { Request, Response } from 'express'
import { Token } from '../../../entities/token.entity'
import AccountController from '../../../modules/account/account.controller'
import CognitoController from '../../../modules/cognito/cognito.controller'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {})

export default router
