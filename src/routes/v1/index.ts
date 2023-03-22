import express from 'express'
const router = express.Router()
import account from './account'

router.use('/v1/account', account)
export default router
