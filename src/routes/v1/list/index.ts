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
  try {
    const { jwtPayload } = req.body
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

router.patch('/', async (req: Request, res: Response) => {
  try {
    const { jwtPayload, title, description, isDone, toDoListId } = req.body
    if (!title) {
      return res.status(Constants.HTTP_CODES.BAD_REQUEST).json({
        message: 'title is required',
      })
    }
    if (!description) {
      return res.status(Constants.HTTP_CODES.BAD_REQUEST).json({
        message: 'description is required',
      })
    }
    if (isDone === undefined || typeof isDone !== 'boolean') {
      return res.status(Constants.HTTP_CODES.BAD_REQUEST).json({
        message: 'isDone is required and must be boolean',
      })
    }
    if (!toDoListId) {
      return res.status(Constants.HTTP_CODES.BAD_REQUEST).json({
        message: 'toDoListId is required',
      })
    }
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
})

router.delete('/', async (req: Request, res: Response) => {
  try {
    const {
      jwtPayload,
      toDoListId,
      flag,
    }: {
      jwtPayload: any
      toDoListId: string
      flag: 'DELETE_ALL' | 'DELETE_ONE'
    } = req.body
    if (flag !== 'DELETE_ALL' && flag !== 'DELETE_ONE') {
      return res.status(Constants.HTTP_CODES.BAD_REQUEST).json({
        message: "flag is required to be 'DELETE_ALL' or 'DELETE_ONE'",
      })
    }
    if (flag === 'DELETE_ONE' && !toDoListId) {
      return res.status(Constants.HTTP_CODES.BAD_REQUEST).json({
        message: 'toDoListId is required',
      })
    }
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
})

export default router
