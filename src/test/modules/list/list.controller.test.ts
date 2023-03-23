import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import ListController from '../../../modules/list/list.controller'
import userModel from '../../../database/model/user.model'

let mongoServer: MongoMemoryServer
let listController: ListController

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await mongoose.connect(mongoUri)
  listController = new ListController()
  await userModel.create({
    username: 'username',
    sub: 'sub',
    email: 'email',
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('addToList', () => {
  it("should add a to-do item to the user's to-do list", async () => {
    const mockObject = {
      title: 'title',
      description: 'description',
      username: 'username',
    }
    const addToListResponse = await listController.addToList(mockObject)
    const expectedAddToListResponse = {
      acknowledged: true,
      modifiedCount: 1,
      upsertedId: null,
      upsertedCount: 0,
      matchedCount: 1,
    }
    expect(addToListResponse).toStrictEqual(expectedAddToListResponse)
    const userResponse = await userModel
      .findOne({
        username: 'username',
      })
      .lean()
    const expectedUserResponse = {
      email: 'email',
      username: 'username',
      sub: 'sub',
      toDoList: [
        {
          title: 'title',
          description: 'description',
          isDone: false,
        },
      ],
    }
    expect(userResponse).toMatchObject(expectedUserResponse)
  })
})

describe('getList', () => {
  it('should return the user object with only toDoList property', async () => {
    const expectedToDoList = {
      title: 'title',
      description: 'description',
      isDone: false,
    }
    const expectedUserObject = new userModel({
      email: '_email',
      username: '_username',
      sub: '_sub',
      toDoList: [expectedToDoList],
    })
    await expectedUserObject.save()

    const mockUsername = '_username'
    const actualUserResponse = await listController.getList({
      username: mockUsername,
    })

    expect(actualUserResponse).toBeDefined()
    expect(actualUserResponse?.toDoList.length).toBe(1)
    expect(actualUserResponse?.toDoList[0]).toMatchObject(expectedToDoList)
  })

  it('should return null when the user is not found', async () => {
    const mockUsername = 'nonexistent_user'
    const actualUserResponse = await listController.getList({
      username: mockUsername,
    })

    expect(actualUserResponse).toBeNull()
  })
})
