import mongoose, { UpdateWriteOpResult } from 'mongoose'
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

describe('updateList', () => {
  it('should update a task in the user to-do list', async () => {
    // Create a mock user in the database
    const mockUser = {
      email: 'test@test.com',
      username: 'testuser',
      sub: '1234567890',
      toDoList: [
        {
          title: 'Task 1',
          description: 'Do task 1',
          isDone: false,
        },
      ],
    }
    const newUser = await userModel.create(mockUser)
    // Call the updateList method with mock arguments
    const mockToDoListId = newUser.toDoList[0]._id.toString()
    const mockTitle = 'Updated Task'
    const mockDescription = 'Do the updated task'
    const mockIsDone = true
    const actualResult: UpdateWriteOpResult = await listController.updateList({
      username: mockUser.username,
      toDoListId: mockToDoListId,
      title: mockTitle,
      description: mockDescription,
      isDone: mockIsDone,
    })

    const userResponse = await userModel.findOne({
      username: mockUser.username,
    })
    expect(userResponse?.toDoList[0].title).toEqual(mockTitle)
    expect(userResponse?.toDoList[0].description).toEqual(mockDescription)
    expect(userResponse?.toDoList[0].isDone).toEqual(mockIsDone)
  })
  it('should throw an error when toDoListId does not exist', async () => {
    // Create a mock user document with a toDoList array that does not contain the target toDoListId
    const mockUser = {
      username: 'mock_user',
      sub: 'test-sub',
      email: 'test-email',
      toDoList: [
        {
          title: 'Existing Title',
          description: 'Existing Description',
          isDone: false,
        },
      ],
    }
    await userModel.create(mockUser)

    const toDoListId = '641b1255e0128b5bad081a22'
    const update = await listController.updateList({
      username: mockUser.username,
      toDoListId,
      title: 'New Title',
      description: 'New Description',
      isDone: true,
    })
    const expectedUpdate = {
      acknowledged: true,
      modifiedCount: 0,
      upsertedId: null,
      upsertedCount: 0,
      matchedCount: 0,
    }
    expect(update).toStrictEqual(expectedUpdate)
  })
})
