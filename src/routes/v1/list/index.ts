import express, { Request, Response } from 'express'
import { Constants } from '../../../constants'
import ListController from '../../../modules/list/list.controller'

const router = express.Router()
const listController = new ListController()

router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, jwtPayload } = req.body
    if (!title)
      return res.status(Constants.HTTP_CODES.BAD_REQUEST).json({
        message: Constants.ERROR_MESSAGES.TITLE_REQUIRED,
      })
    const response = await listController.addToList({
      title,
      description,
      username: jwtPayload.username,
    })
    return res.status(Constants.HTTP_CODES.CREATED).json(response)
  } catch (err: any) {
    return res.status(Constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      message: err?.message,
      code: err?.code,
    })
  }
})

router.get('/', async (req: Request, res: Response) => {
  const { jwtPayload } = req.body
  res.json(jwtPayload)
})

router.patch('/', async (req: Request, res: Response) => {})

router.delete('/', async (req: Request, res: Response) => {})

export default router
