import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import AccountService from '../../../modules/account/account.service'
import userModel from '../../../database/model/user.model'

let mongoServer: MongoMemoryServer
const accountService = new AccountService()

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('featureAccessController', () => {
  describe('createUser', () => {
    afterEach(async () => {
      await mongoose.connection.db.dropCollection('users')
    })
    it('should create a new user', async () => {
      // Call the createUser method with user information
      await accountService.createUser({
        sub: '123',
        email: 'test@example.com',
        username: 'testuser',
      })

      // Expect a user document to be created in the database
      const dbUser = await userModel.findOne({ email: 'test@example.com' })
      expect(dbUser).toMatchObject({
        sub: '123',
        email: 'test@example.com',
        username: 'testuser',
      })
    })

    it('should update an existing user', async () => {
      await userModel.create({
        sub: '456',
        email: 'test@example.com',
        username: 'testuser',
      })

      await accountService.createUser({
        sub: '789',
        email: 'test@example.com',
        username: 'updateduser',
      })

      const updatedDbUser = await userModel.findOne({
        email: 'test@example.com',
      })
      expect(updatedDbUser).toMatchObject({
        sub: '789',
        email: 'test@example.com',
        username: 'updateduser',
      })
    })
  })
  describe('getUser', () => {})
})
