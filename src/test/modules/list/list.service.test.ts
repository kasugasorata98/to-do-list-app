import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import userModel, { User } from '../../../database/model/user.model'
import ListService from '../../../modules/list/list.service'

let mongoServer: MongoMemoryServer
let listService: ListService

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await mongoose.connect(mongoUri)
  listService = new ListService()
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

beforeEach(async () => {
  listService = new ListService()
  const mockUser = {
    username: 'testuser',
    sub: 'testusersub',
    email: 'testuser_email',
  }
  await userModel.create(mockUser)
})

afterEach(async () => {
  await userModel.deleteMany({})
})

describe('addToList', () => {
  it('should add a new item to the to-do list', async () => {
    const username = 'testuser'
    const title = 'Test Title'
    const description = 'Test Description'

    await listService.addToList({ username, title, description })

    const userResponse = await userModel.findOne({
      username: 'testuser',
    })

    expect(userResponse?.toDoList[0]).toMatchObject({
      title: 'Test Title',
      description: 'Test Description',
    })
  })
})

describe('getList', () => {
  it('should return a user with toDoList array', async () => {
    await listService.addToList({
      username: 'testuser',
      title: 'Test to-do item',
      description: 'This is a test to-do item',
    })

    const result = await listService.getList({ username: 'testuser' })

    expect(result).toBeTruthy()
    expect(result!.toDoList[0]).toMatchObject({
      title: 'Test to-do item',
      description: 'This is a test to-do item',
      isDone: false,
    })
  })

  it('should return null if user does not exist', async () => {
    const result = await listService.getList({ username: 'nonexistentuser' })
    expect(result).toBeNull()
  })
})

describe('updateList', () => {
  it("should update a todo item in the user's to-do list", async () => {
    // Create a user with a to-do list item
    const user = await userModel.create({
      username: 'testuser3',
      email: 'testuse3r@example.com',
      sub: 'testsub3',
      toDoList: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Finish work',
          description: 'Complete the report by 5pm',
          isDone: false,
        },
      ],
    })

    // Update the user's to-do list item
    const updateResult = await listService.updateList({
      username: user.username,
      toDoListId: user.toDoList[0]._id,
      title: 'Finish report',
      description: 'Complete the report by 4pm',
      isDone: true,
    })

    expect(updateResult).toStrictEqual({
      acknowledged: true,
      modifiedCount: 1,
      upsertedId: null,
      upsertedCount: 0,
      matchedCount: 1,
    })

    const updatedUser = await userModel.findOne({ username: user.username })

    expect(updatedUser?.toDoList).toHaveLength(1)
    expect(updatedUser?.toDoList[0]).toMatchObject({
      title: 'Finish report',
      description: 'Complete the report by 4pm',
      isDone: true,
    })
  })

  it('should throw an error when toDoListId does not exist', async () => {
    const user = await userModel.create({
      username: 'testuser2',
      email: 'testuser2@example.com',
      sub: 'testsub2',
      toDoList: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'Finish work',
          description: 'Complete the report by 5pm',
          isDone: false,
        },
      ],
    })

    // Update the user's to-do list item with an invalid ID
    const update = await listService.updateList({
      username: user.username,
      toDoListId: '641b1255e0128b5bad081a22',
      title: 'Finish report',
      description: 'Complete the report by 4pm',
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

describe('getList', () => {
  let mockUser: User
  beforeEach(async () => {
    mockUser = await userModel.create({
      email: 'test@example.com_',
      username: 'testuser_',
      sub: '12345_',
      toDoList: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: 'test',
          description: 'test description',
          isDone: false,
        },
      ],
    })
  })

  afterEach(async () => {
    await userModel.deleteMany({})
  })

  it('should delete a toDoList item for a user', async () => {
    const mockToDelete = mockUser.toDoList[0]._id
    const result = await listService.deleteList({
      username: mockUser.username,
      toDoListId: mockToDelete,
    })
    expect(result).toStrictEqual({
      acknowledged: true,
      modifiedCount: 1,
      upsertedId: null,
      upsertedCount: 0,
      matchedCount: 1,
    })
    const updatedUser = await userModel.findOne({ username: mockUser.username })
    expect(updatedUser?.toDoList.length).toBe(0)
  })

  it('should not delete toDoList when toDoListId does not exist', async () => {
    const nonExistentId = '641b1255e0128b5bad081a22'
    const result = await listService.deleteList({
      username: mockUser.username,
      toDoListId: nonExistentId,
    })
    expect(result).toStrictEqual({
      acknowledged: true,
      modifiedCount: 1,
      upsertedId: null,
      upsertedCount: 0,
      matchedCount: 1,
    })
    const updatedUser = await userModel.findOne({ username: mockUser.username })
    expect(updatedUser?.toDoList.length).toBe(1)
  })
})

describe('deleteAll', () => {
  it('should delete all items from user todo list', async () => {
    const testUser = {
      username: 'testusertestuser',
      email: 'testusertestuser',
      sub: 'testusertestuser',
      toDoList: [
        { title: 'item1', description: 'description1' },
        { title: 'item2', description: 'description2' },
      ],
    }
    await userModel.create(testUser)

    const result = await listService.deleteAll({ username: 'testusertestuser' })

    expect(result).toStrictEqual({
      acknowledged: true,
      modifiedCount: 1,
      upsertedId: null,
      upsertedCount: 0,
      matchedCount: 1,
    })

    const user = await userModel.findOne({ username: 'testusertestuser' })
    expect(user?.toDoList).toHaveLength(0)
  })
})
