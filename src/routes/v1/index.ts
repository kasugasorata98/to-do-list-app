import express from 'express'
const router = express.Router()
import account from './account'
import list from './list'

router.use('/v1/account', account)
router.use('/v1/list', list)
export default router
