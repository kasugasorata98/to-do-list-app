import express, { Request, Response } from 'express'
import { Constants } from '../../../constants'
import { AddListRequest } from '../../../entities/add-list.request.entity'
import { DeleteListRequest } from '../../../entities/delete-list.request.entity'
import { JwtPayload } from '../../../entities/jwtpayload.entity'
import { UpdateListRequest } from '../../../entities/update-list.request.entity'
import ListController from '../../../modules/list/list.controller'
import { body, validationResult } from 'express-validator'

const router = express.Router()
const listController = new ListController()

router.post(
  '/',
  [body('title').isString()],
  async (req: Request, res: Response) => {
    try {
      const { title, description, jwtPayload }: AddListRequest = req.body
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res
          .status(Constants.HTTP_CODES.BAD_REQUEST)
          .json({ errors: errors.array() })
      }
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
  }
)

router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      jwtPayload,
    }: {
      jwtPayload: JwtPayload
    } = req.body
    const { username } = jwtPayload
    const response = await listController.getList({ username })
    res.json(response)
  } catch (err: any) {
    return res.status(Constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      message: err?.message,
      code: err?.code,
    })
  }
})

router.patch(
  '/',
  [
    body('title').isString(),
    body('isDone').isBoolean(),
    body('toDoListId').isString(),
  ],
  async (req: Request, res: Response) => {
    try {
      const {
        jwtPayload,
        title,
        description,
        isDone,
        toDoListId,
      }: UpdateListRequest = req.body
      const { username } = jwtPayload
      const response = await listController.updateList({
        username,
        title,
        description,
        isDone,
        toDoListId,
      })
      res.json(response)
    } catch (err: any) {
      return res.status(Constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        message: err?.message,
        code: err?.code,
      })
    }
  }
)

router.delete(
  '/',
  [
    body('toDoListId').custom((value, { req }) => {
      if (req.body.flag === 'DELETE_ONE' && !req.body.toDoListId) {
        throw new Error('The toDoListId is required when flag=DELETE_ONE')
      }
      return true
    }),
    body('flag').isIn(['DELETE_ALL', 'DELETE_ONE']),
  ],
  async (req: Request, res: Response) => {
    try {
      const { jwtPayload, toDoListId, flag }: DeleteListRequest = req.body
      const { username } = jwtPayload
      const response = await listController.deleteList({
        username,
        toDoListId,
        flag,
      })
      res.json(response)
    } catch (err: any) {
      return res.status(Constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json({
        message: err?.message,
        code: err?.code,
      })
    }
  }
)

export default router
