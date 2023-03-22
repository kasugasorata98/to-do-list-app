import express from 'express'
import { validateJwt } from '../../middlewares/validateJwt.middleware'
const router = express.Router()
import account from './account'
import list from './list'

router.use('/v1/account', account)
router.use('/v1/list', validateJwt, list)
export default router
